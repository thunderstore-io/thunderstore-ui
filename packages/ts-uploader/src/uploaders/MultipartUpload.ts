import { UploadPartUrl, UserMedia } from "./types";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";
import { BaseUpload } from "./BaseUpload";
import {
  UploadConfig,
  UploadProgress,
  MultiPartUploadOptions,
  UploadPartStatus,
} from "./types";
import { getMD5WorkerManager, MD5WorkerManager } from "../workers";
import {
  postUsermediaAbort,
  postUsermediaFinish,
  postUsermediaInitiate,
  RequestConfig,
} from "@thunderstore/thunderstore-api";
import {
  FinishedTask,
  StartedTask,
  Task,
  TaskFinishReason,
  TaskStatus,
} from "../tasks/types";
import { TaskManager } from "../tasks/taskManager";

/**
 * A multi-part upload consists of 3 stages:
 *
 * 1. Creating an upload handle on the server. Server returns back an ID and
 *    configuration for how the upload should be chunked.
 * 2. Uploading all chunks to URLs provided by the server in step 1 and storing
 *    the resulting IDs (response ETag header)
 * 3. Finalizing the upload by submitting all chunk IDs obtained from step 2
 *    to the server along with the upload handle ID.
 */

export type UploadPart = {
  payload: Blob;
  meta: {
    part_number: number;
    url: string;
  };
  etag?: string;
};

export type PartState = {
  part: UploadPart;
  uniqueId: string;
  state: UploadPartStatus;
  etag: string | undefined;
  error: string | undefined;
  checksum: string | undefined;
};

export type PartStates = {
  [key: string]: PartState;
};

export interface IUploadHandle {
  get progress(): UploadProgress;
  onProgress: TypedEventEmitter<UploadProgress>;
}

export class MultipartUpload extends BaseUpload {
  private file: File;
  private parts: UploadPart[] = [];
  private partStates: PartStates = {};
  private usermedia: UserMedia;
  private md5WorkerManager: MD5WorkerManager;
  private requestConfig: () => RequestConfig;
  taskManager: TaskManager;

  constructor(
    options: MultiPartUploadOptions,
    requestConfig: () => RequestConfig,
    config?: UploadConfig
  ) {
    super(config);
    this.file = options.file;
    this.metrics.totalBytes = this.file.size;
    this.md5WorkerManager = getMD5WorkerManager();
    this.requestConfig = requestConfig;
    this.usermedia = {
      uuid: "",
      datetime_created: "",
      expiry: "",
      status: "not_started",
      filename: this.file.name,
      size: this.file.size,
    };
    this.taskManager = new TaskManager();
  }

  get handle(): UserMedia {
    return this.usermedia;
  }

  async start(): Promise<void> {
    if (this.status === "running") {
      this.setError({
        code: "UPLOAD_ALREADY_RUNNING",
        message: "Upload already running",
        retryable: false,
        details: undefined,
      });
      return;
    }

    try {
      await this.initiateUploadAndCreatePartUploadTasks();
      // await this.beginUploadingParts();
      await this.batchEm(this.taskManager.createdTasks);
      await this.finalizeUpload();
    } catch (error) {
      this.setError({
        code: "UPLOAD_FAILED",
        message: error.message,
        retryable: true,
        details: error,
      });
      this.setStatus("failed");
    }
  }

  async pause() {
    this.taskManager.startedTasks.forEach((t) => this.taskManager.abortTask(t));
    this.setStatus("paused");
  }

  async resume() {
    this.setStatus("running");
    const tasksThatShouldBeRetried = this.collectUploadPartTasks(
      this.taskManager.tasks,
      this.taskManager.finishedTasks
    );

    console.log(tasksThatShouldBeRetried);
    await this.batchEm(tasksThatShouldBeRetried);
    await this.finalizeUpload();
  }

  async abort() {
    this.taskManager.startedTasks.forEach(async (t) => {
      await this.taskManager.abortTask(t);
    });
    this.usermedia = await postUsermediaAbort({
      config: this.requestConfig,
      params: {
        uuid: this.usermedia.uuid,
      },
      data: {},
      queryParams: {},
      useSession: true,
    });
    this.setStatus("aborted");
  }

  async retry() {
    this.setStatus("running");
    const tasksThatShouldBeRetried = this.collectUploadPartTasks(
      this.taskManager.tasks,
      this.taskManager.finishedTasks
    );

    await this.batchEm(tasksThatShouldBeRetried);
    await this.finalizeUpload();
  }

  async initiateUploadAndCreatePartUploadTasks(): Promise<void> {
    // Initialize upload
    const { user_media, upload_urls } = await postUsermediaInitiate({
      config: this.requestConfig,
      params: {},
      data: {
        filename: this.file.name,
        file_size_bytes: this.file.size,
      },
      queryParams: {},
      useSession: true,
    });
    this.usermedia = user_media;

    this.parts = this.createParts(this.file, upload_urls);
    this.partStates = this.prepareParts(this.parts, this.usermedia);
    this.parts.map((part) =>
      this.taskManager.createTask((part) => this.uploadPart(part), part)
    );
  }

  async uploadPart(part: UploadPart) {
    const uniqueId = `${this.usermedia.uuid}-${part.meta.part_number}`;

    const checksum = await this.md5WorkerManager.calculateMD5(
      uniqueId,
      part.payload
    );

    this.partStates[uniqueId] = {
      part,
      uniqueId,
      state: "running",
      etag: undefined,
      error: undefined,
      checksum,
    };

    await this.doPartUpload(part, uniqueId, checksum);
  }

  async finalizeUpload() {
    if (
      this.status === "complete" ||
      this.status === "paused" ||
      this.status === "aborted"
    ) {
      return;
    }

    if (
      Object.values(this.partStates).some((part) => part.state === "failed")
    ) {
      this.setError({
        code: "UPLOAD_FAILED",
        message: "Parts of the upload failed, please retry.",
        retryable: true,
        details: undefined,
      });
      this.setStatus("failed");
      return;
    }

    const completeParts: { ETag: string; PartNumber: number }[] = [];

    Object.values(this.partStates).map((ps) => {
      if (!ps.etag) {
        this.setError({
          code: "UPLOAD_FAILED",
          message: "Parts of the upload were not uploaded correctly.",
          retryable: true,
          details: undefined,
        });
        this.setStatus("failed");
        return;
      }
      completeParts.push({
        ETag: ps.etag,
        PartNumber: ps.part.meta.part_number,
      });
    });

    // Complete upload
    this.usermedia = await postUsermediaFinish({
      config: this.requestConfig,
      params: {
        uuid: this.usermedia.uuid,
      },
      data: {
        parts: completeParts,
      },
      queryParams: {},
      useSession: true,
    });

    this.setStatus("complete");
  }

  slicePart(file: File, offset: number, length: number): Blob {
    const start = offset;
    const end = offset + length;
    return end < file.size ? file.slice(start, end) : file.slice(start);
  }

  createParts(file: File, uploadUrls: UploadPartUrl[]): UploadPart[] {
    return uploadUrls.map((x) => ({
      payload: this.slicePart(file, x.offset, x.length),
      meta: {
        part_number: x.part_number,
        url: x.url,
      },
    }));
  }

  prepareParts(parts: UploadPart[], usermedia: UserMedia): PartStates {
    const partStates: PartStates = {};
    for (let i = 0; i < parts.length; i++) {
      const uniqueId = `${usermedia.uuid}-${parts[i].meta.part_number}`;
      this.partsProgress[uniqueId] = {
        total: parts[i].payload.size,
        complete: 0,
        status: "prepared",
      };
      partStates[uniqueId] = {
        part: parts[i],
        uniqueId,
        state: "prepared",
        etag: undefined,
        error: undefined,
        checksum: undefined,
      };
    }
    return partStates;
  }

  async doPartUpload(part: UploadPart, uniqueId: string, checksum: string) {
    await new Promise<void>((resolve, reject) => {
      if (this.status === "paused" || this.status === "aborted") {
        reject();
      }

      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        console.log(this.status);
        if (this.status === "paused" || this.status === "aborted") {
          xhr.abort();
          reject();
        }
        if (event.lengthComputable) {
          this.updateProgress(uniqueId, {
            total: event.total,
            complete: event.loaded,
            status: "running",
          });
        }
      };

      // Set up completion handler
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.partStates[uniqueId].etag =
            xhr.getResponseHeader("ETag") ?? undefined;
          this.partStates[uniqueId].state = "complete";
          resolve();
        } else {
          this.partStates[uniqueId].error = `HTTP error: ${xhr.status}`;
          this.partStates[uniqueId].state = "failed";
          this.setError({
            code: "UPLOAD_FAILED",
            message: `HTTP error: ${xhr.status}`,
            retryable: true,
            details: xhr,
          });
          reject();
        }
      };

      // Set up error handler
      xhr.onerror = () => {
        this.partStates[uniqueId].error = "Network error";
        this.partStates[uniqueId].state = "failed";
        this.setError({
          code: "UPLOAD_FAILED",
          message: "Network error",
          retryable: true,
          details: xhr,
        });
        reject();
      };

      // Open and send the request
      xhr.open("PUT", part.meta.url);
      xhr.setRequestHeader("Content-MD5", checksum);
      xhr.send(part.payload);
    });
  }

  // Collects all the tasks that should be retried and deduplicates them based on part number
  collectUploadPartTasks(
    uploadPartTasks: Task<UploadPart, void>[],
    finishedUploadPartTasks: FinishedTask<UploadPart, void>[]
  ) {
    const successfulPartNumbers = finishedUploadPartTasks
      .filter((t) => t.finishReason === TaskFinishReason.SUCCESS)
      .map((t) => t.args.meta.url);

    return uploadPartTasks
      .filter(
        (task) =>
          ((task.status === TaskStatus.FINISHED &&
            (task.finishReason === TaskFinishReason.ABORTED ||
              task.finishReason === TaskFinishReason.ERROR)) ||
            task.status === TaskStatus.PENDING ||
            task.status === TaskStatus.STARTED) &&
          !(task.args.meta.url in successfulPartNumbers)
      )
      .reduce((acc: Task<UploadPart, void>[], task) => {
        if (!acc.map((t) => t.args.meta.url).includes(task.args.meta.url)) {
          acc.push(task);
        }
        return acc;
      }, []);
  }

  batchEm(tasks: Task<any, any>[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      console.log("batchEm", this.status);
      if (this.status === "paused" || this.status === "aborted") {
        reject(new Error("Upload is paused or aborted"));
      }

      const maxConcurrent = this.config.maxConcurrentUploads ?? 3;
      for (let i = 0; i < tasks.length; i += maxConcurrent) {
        if (this.status === "paused" || this.status === "aborted") {
          reject(new Error("Upload is paused or aborted"));
        }
        const taskPromises: Promise<FinishedTask<any, any>>[] = [];
        const batch = tasks.slice(i, i + maxConcurrent);

        const startedTasks = batch.map((t) =>
          t.status === TaskStatus.PENDING
            ? this.taskManager.startTask(t)
            : t.status === TaskStatus.FINISHED
              ? this.taskManager.restartTask(t)
              : t
        );

        console.log("startedTasks", startedTasks);
        for (let i = 0; i < startedTasks.length; i++) {
          taskPromises.push(this.taskManager.waitTask(startedTasks[i]));
        }

        await Promise.all(taskPromises);
        resolve();
      }
    });
  }
}
