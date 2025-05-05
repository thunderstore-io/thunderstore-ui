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
  abortTask,
  createTask,
  restartTask,
  startTask,
  waitTask,
} from "../tasks/task";
import {
  FinishedTask,
  Task,
  TaskFinishReason,
  TaskStatus,
} from "../tasks/types";

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

type UploadPart = {
  payload: Blob;
  meta: {
    part_number: number;
    url: string;
  };
  etag?: string;
};

type PartState = {
  part: UploadPart;
  uniqueId: string;
  state: UploadPartStatus;
  etag: string | undefined;
  error: string | undefined;
  checksum: string | undefined;
};

type PartStates = {
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
  private uploadPartTasks: Task<UploadPart, void>[] = [];

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
  }

  get handle(): UserMedia {
    return this.usermedia;
  }

  // TODO: Create a task manager class and move these into it
  get createdUploadPartTasks() {
    return this.uploadPartTasks.filter(
      (task) => task.status === TaskStatus.PENDING
    );
  }

  get startedUploadPartTasks() {
    return this.uploadPartTasks.filter(
      (task) => task.status === TaskStatus.STARTED
    );
  }

  get finishedUploadPartTasks(): FinishedTask<UploadPart, void>[] {
    return this.uploadPartTasks.filter(
      (task) =>
        task.status === TaskStatus.FINISHED &&
        (task.finishReason === TaskFinishReason.ABORTED ||
          task.finishReason === TaskFinishReason.ERROR ||
          task.finishReason === TaskFinishReason.SUCCESS)
    );
  }

  get abortedUploadPartTasks() {
    return this.finishedUploadPartTasks.filter(
      (task) => task.finishReason === TaskFinishReason.ABORTED
    );
  }

  get erroredUploadPartTasks() {
    return this.finishedUploadPartTasks.filter(
      (task) => task.finishReason === TaskFinishReason.ERROR
    );
  }

  get successfulUploadPartTasks() {
    return this.finishedUploadPartTasks.filter(
      (task) => task.finishReason === TaskFinishReason.SUCCESS
    );
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
      this.setStatus("running");
      this.metrics.startTime = Date.now();
      this.metrics.lastUpdateTime = this.metrics.startTime;

      // Initialize upload
      const { user_media, upload_urls } = await this.inititateUpload(
        this.file,
        this.requestConfig
      );
      this.usermedia = user_media;

      // Create parts
      this.parts = this.createParts(this.file, upload_urls);

      // Prepare parts
      this.partStates = this.prepareParts(this.parts, this.usermedia);

      // Create tasks
      const createdTasks = this.parts.map((part) =>
        createTask((part) => this.uploadPart(part), part)
      );

      // Batch complete tasks
      const maxConcurrent = this.config.maxConcurrentUploads ?? 3;
      for (let i = 0; i < createdTasks.length; i += maxConcurrent) {
        const batch = createdTasks.slice(i, i + maxConcurrent);
        // Start tasks
        const taskPromises = batch.map(startTask).map(waitTask);

        // Wait for all tasks in the batch to finish
        const batchFinishedTasks = await Promise.all(taskPromises);
        this.uploadPartTasks.push(...batchFinishedTasks);
      }

      await this.complete();
    } catch (error) {
      this.setError({
        code: "UPLOAD_FAILED",
        message: error.message,
        retryable: true,
        details: error,
      });
      this.setStatus("failed");
      this.usermedia.status = "failed";
    }
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
      state: "pending",
      etag: undefined,
      error: undefined,
      checksum,
    };

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
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
      if (checksum) {
        xhr.setRequestHeader("Content-MD5", checksum);
      }
      xhr.send(part.payload);
      this.partStates[uniqueId].state = "running";
    });
  }

  async complete() {
    if (this.status === "complete") {
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
    this.usermedia = await this.finishUpload(
      this.usermedia.uuid,
      completeParts,
      this.requestConfig
    );

    this.setStatus("complete");
  }

  async pause() {
    this.startedUploadPartTasks.forEach((t) => abortTask(t));
    this.usermedia.status = "paused";
  }

  async resume() {
    this.setStatus("running");
    const tasksThatShouldBeRetried = this.collectUploadPartTasks(
      this.uploadPartTasks,
      this.finishedUploadPartTasks
    );

    const maxConcurrent = this.config.maxConcurrentUploads ?? 3;
    for (let i = 0; i < tasksThatShouldBeRetried.length; i += maxConcurrent) {
      const batch = tasksThatShouldBeRetried.slice(i, i + maxConcurrent);
      const startedTasks = batch.map((t) =>
        t.status === TaskStatus.PENDING
          ? startTask(t)
          : t.status === TaskStatus.FINISHED
            ? restartTask(t)
            : t
      );
      const taskPromises = startedTasks.map(waitTask);
      const batchFinishedTasks = await Promise.all(taskPromises);
      this.finishedUploadPartTasks.push(...batchFinishedTasks);
    }

    await this.complete();
  }

  async abort() {
    this.startedUploadPartTasks.forEach((t) => abortTask(t));
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
      this.uploadPartTasks,
      this.finishedUploadPartTasks
    );

    const maxConcurrent = this.config.maxConcurrentUploads ?? 3;
    for (let i = 0; i < tasksThatShouldBeRetried.length; i += maxConcurrent) {
      const batch = tasksThatShouldBeRetried.slice(i, i + maxConcurrent);
      const startedTasks = batch.map((t) =>
        t.status === TaskStatus.PENDING
          ? startTask(t)
          : t.status === TaskStatus.FINISHED
            ? restartTask(t)
            : t
      );
      const taskPromises = startedTasks.map(waitTask);
      const batchFinishedTasks = await Promise.all(taskPromises);
      this.finishedUploadPartTasks.push(...batchFinishedTasks);
    }

    await this.complete();
  }

  async inititateUpload(
    file: File,
    requestConfig: () => RequestConfig
  ): Promise<ReturnType<typeof postUsermediaInitiate>> {
    return await postUsermediaInitiate({
      config: requestConfig,
      params: {},
      data: {
        filename: file.name,
        file_size_bytes: file.size,
      },
      queryParams: {},
      useSession: true,
    });
  }

  async finishUpload(
    userMediaUuid: string,
    completeParts: { ETag: string; PartNumber: number }[],
    requestConfig: () => RequestConfig
  ): Promise<ReturnType<typeof postUsermediaFinish>> {
    return await postUsermediaFinish({
      config: requestConfig,
      params: {
        uuid: userMediaUuid,
      },
      data: {
        parts: completeParts,
      },
      queryParams: {},
      useSession: true,
    });
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
}
