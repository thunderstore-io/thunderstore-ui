import { GraphExecutor, GraphNode } from "@thunderstore/graph-system";
import {
  type RequestConfig,
  postUsermediaAbort,
  postUsermediaFinish,
  postUsermediaInitiate,
} from "@thunderstore/thunderstore-api";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

import { MD5WorkerManager, getMD5WorkerManager } from "../workers";
import { BaseUpload } from "./BaseUpload";
import type {
  CompleteUpload,
  FinalizedUpload,
  MultiPartUploadOptions,
  PreparedUpload,
  UploadConfig,
  UploadPartError,
  UploadPartStatus,
  UploadPartUrl,
  UploadProgress,
  UploadStatus,
  UserMedia,
} from "./types";
import { slicePart } from "./utls";

export interface UploadPart {
  payload: Blob;
  meta: {
    part_number: number;
    url: string;
  };
  etag?: string;
}

export interface PartState {
  part: UploadPart;
  uniqueId: string;
  state: UploadPartStatus;
  etag: string | undefined;
  error: string | undefined;
  checksum: string | undefined;
}

export interface PreparedPartState extends Omit<PartState, "checksum"> {
  checksum: string;
}

export interface CompletePartState extends Omit<PreparedPartState, "etag"> {
  etag: string;
}

export type PartStates = {
  [key: string]: PartState;
};

export interface IUploadHandle {
  get progress(): UploadProgress;
  onProgress: TypedEventEmitter<UploadProgress>;
}

export class MultipartUpload extends BaseUpload {
  private file: File;
  private _handle?: UserMedia;
  private requestConfig: () => RequestConfig;
  private executor?: GraphExecutor<CompleteUpload, FinalizedUpload>;
  private graphCompleteListener?: () => void;

  constructor(
    options: MultiPartUploadOptions,
    requestConfig: () => RequestConfig,
    config?: UploadConfig
  ) {
    super(config);
    this.file = options.file;
    this.metrics.totalBytes = this.file.size;
    this._handle = undefined;
    this.requestConfig = requestConfig;
    this.executor = undefined;
    this.graphCompleteListener = undefined;
  }

  get handle(): UserMedia {
    if (this._handle === undefined) {
      throw new Error("MultipartUpload.handle accessed before set");
    }

    return this._handle;
  }

  set handle(handle: UserMedia) {
    this._handle = handle;
  }

  get currentStatus(): UploadStatus {
    return this.status;
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

    // Upload inputs
    const uploadInputsNode = new GraphNode<
      unknown,
      {
        file: File;
        requestConfig: () => RequestConfig;
        MPU: MultipartUpload;
      }
    >(async () => {
      return {
        file: this.file,
        requestConfig: this.requestConfig,
        MPU: this,
      };
    });

    // Create upload
    const createUploadNode = new GraphNode<
      {
        file: File;
        requestConfig: () => RequestConfig;
        MPU: MultipartUpload;
      },
      {
        file: File;
        uploadUrls: UploadPartUrl[];
        usermedia: UserMedia;
        md5WorkerManager: MD5WorkerManager;
        requestConfig: () => RequestConfig;
        MPU: MultipartUpload;
      }
    >(createUpload);

    // Create parts
    const createPartsNode = new GraphNode<
      {
        file: File;
        uploadUrls: UploadPartUrl[];
        usermedia: UserMedia;
        md5WorkerManager: MD5WorkerManager;
        requestConfig: () => RequestConfig;
        MPU: MultipartUpload;
      },
      {
        upload: PreparedUpload;
        MPU: MultipartUpload;
      }
    >(createParts);

    // Do part uploads (this is somewhat of a extra layer for parallelization of the part uploads)
    const doPartUploadsNode = new GraphNode<
      {
        upload: PreparedUpload;
        MPU: MultipartUpload;
      },
      (UploadPartError | [PreparedUpload, CompletePartState])[]
    >(doPartUploads);

    // Confirm that parts are uploaded and no errors occurred
    const confirmPartsUploadedNode = new GraphNode<
      (UploadPartError | [PreparedUpload, CompletePartState])[],
      CompleteUpload
    >(confirmPartsAreUploaded);

    // Finalize upload
    const outputNode = new GraphNode<CompleteUpload, FinalizedUpload>(
      finalizeUpload
    );

    GraphNode.soloLink(uploadInputsNode, createUploadNode);
    GraphNode.soloLink(createUploadNode, createPartsNode);
    GraphNode.soloLink(createPartsNode, doPartUploadsNode);
    GraphNode.soloLink(doPartUploadsNode, confirmPartsUploadedNode);
    GraphNode.soloLink(confirmPartsUploadedNode, outputNode);

    this.executor = new GraphExecutor(outputNode);

    this.graphCompleteListener = this.executor.onGraphComplete.addListener(
      (output) => {
        this.handle = output.usermedia;
        this.setStatus("complete");
      }
    );

    try {
      await this.executor.executeGraph();
    } finally {
      // Remove the listener to prevent memory leaks
      this.graphCompleteListener();
    }
  }

  async pause() {
    if (this.executor) {
      await this.executor.stopExecution();
      this.setStatus("paused");
    } else {
      this.setError({
        code: "EXECUTOR_NOT_INITIALIZED",
        message: "Executor not initialized, cannot pause upload",
        retryable: false,
        details: undefined,
      });
      this.setStatus("failed");
    }
  }

  async resume() {
    if (this.executor) {
      await this.executor.resumeExecution();
      this.setStatus("running");
    } else {
      this.setError({
        code: "EXECUTOR_NOT_INITIALIZED",
        message: "Executor not initialized, cannot pause upload",
        retryable: false,
        details: undefined,
      });
      this.setStatus("failed");
    }
  }

  async abort() {
    if (this.executor) {
      await this.executor.stopExecution();
      if (this.graphCompleteListener) {
        this.graphCompleteListener();
      }
      if (this.handle.status !== "upload_complete") {
        // This might be bad, but we can't abort something that is done.
        this.handle = await postUsermediaAbort({
          config: this.requestConfig,
          params: {
            uuid: this.handle.uuid,
          },
          data: {},
          queryParams: {},
          useSession: true,
        });
      }
      // Reset the executor to prevent further uploads with stale upload state
      this.executor = undefined;
      this.setStatus("aborted");
    } else {
      this.setError({
        code: "EXECUTOR_NOT_INITIALIZED",
        message: "Executor not initialized, cannot pause upload",
        retryable: false,
        details: undefined,
      });
      this.setStatus("failed");
    }
  }

  async retry() {
    if (this.executor) {
      await this.executor.resumeExecution();
      this.setStatus("running");
    } else {
      this.setError({
        code: "EXECUTOR_NOT_INITIALIZED",
        message: "Executor not initialized, cannot pause upload",
        retryable: false,
        details: undefined,
      });
      this.setStatus("failed");
    }
  }
}

async function createUpload(props: {
  file: File;
  requestConfig: () => RequestConfig;
  MPU: MultipartUpload;
}): Promise<{
  file: File;
  uploadUrls: UploadPartUrl[];
  usermedia: UserMedia;
  md5WorkerManager: MD5WorkerManager;
  requestConfig: () => RequestConfig;
  MPU: MultipartUpload;
}> {
  // Initialize upload
  const { user_media, upload_urls } = await postUsermediaInitiate({
    config: props.requestConfig,
    params: {},
    data: {
      filename: props.file.name,
      file_size_bytes: props.file.size,
    },
    queryParams: {},
    useSession: true,
  });

  props.MPU.handle = user_media;

  const md5WorkerManager = getMD5WorkerManager();

  return {
    file: props.file,
    uploadUrls: upload_urls,
    usermedia: user_media,
    md5WorkerManager: md5WorkerManager,
    requestConfig: props.requestConfig,
    MPU: props.MPU,
  };
}

async function createParts(props: {
  file: File;
  requestConfig: () => RequestConfig;
  uploadUrls: UploadPartUrl[];
  usermedia: UserMedia;
  md5WorkerManager: MD5WorkerManager;
  MPU: MultipartUpload;
}): Promise<{
  upload: PreparedUpload;
  MPU: MultipartUpload;
}> {
  const uploadParts = props.uploadUrls.map((x) => ({
    payload: slicePart(props.file, x.offset, x.length),
    meta: {
      part_number: x.part_number,
      url: x.url,
    },
  }));

  const partStates: PartStates = {};
  const checksumPromises: Promise<string>[] = [];

  for (let i = 0; i < uploadParts.length; i++) {
    const uniqueId = `${props.usermedia.uuid}-${uploadParts[i].meta.part_number}`;

    props.MPU.addPart(uniqueId, {
      total: uploadParts[i].payload.size,
      complete: 0,
      status: "prepared",
    });

    props.MPU.updateProgress(uniqueId, {
      total: uploadParts[i].payload.size,
      complete: 0,
      status: "prepared",
    });

    const checksum = props.md5WorkerManager.calculateMD5(
      uniqueId,
      uploadParts[i].payload
    );
    checksumPromises.push(checksum);

    partStates[uniqueId] = {
      part: uploadParts[i],
      uniqueId,
      state: "prepared",
      etag: undefined,
      error: undefined,
      checksum: "",
    };
  }

  // Wait for all checksums to be calculated
  const checksums = await Promise.all(checksumPromises);
  // Update the part states with the checksums
  Object.keys(partStates).forEach((key, index) => {
    partStates[key].checksum = checksums[index];
  });

  const upload: PreparedUpload = {
    requestConfig: props.requestConfig,
    usermedia: props.usermedia,
    partStates: Object.values(partStates) as PreparedPartState[],
  };

  return {
    upload,
    MPU: props.MPU,
  };
}

// TODO: This could be simplified
async function uploadPart(input: {
  upload: PreparedUpload;
  partNumber: number;
  MPU: MultipartUpload;
}): Promise<UploadPartError | [PreparedUpload, CompletePartState]> {
  const { upload, partNumber, MPU } = input;

  const { promise, resolve, reject } = Promise.withResolvers<
    UploadPartError | [PreparedUpload, CompletePartState]
  >();

  // Bit of a janky way to find the partstate
  let partState = undefined;
  const partStates = upload.partStates.filter(
    (partState) => partState.part.meta.part_number === partNumber
  );
  partState = partStates.length > 0 ? partStates[0] : undefined;

  if (partState === undefined) {
    reject({
      code: "PART_STATE_NOT_FOUND",
      message: `Part state not found for part number: ${partNumber}`,
      retryable: false,
      details: undefined,
    });
  } else {
    if (
      MPU.currentStatus === "paused" ||
      MPU.currentStatus === "aborted" ||
      MPU.currentStatus === "failed"
    ) {
      reject();
    }

    const xhr = new XMLHttpRequest();

    // Set up progress tracking
    xhr.upload.onprogress = (event) => {
      // console.log(this.status);
      if (
        MPU.currentStatus === "paused" ||
        MPU.currentStatus === "aborted" ||
        MPU.currentStatus === "failed"
      ) {
        xhr.abort();
        reject();
      }
      if (event.lengthComputable) {
        MPU.updateProgress(partState.uniqueId, {
          total: event.total,
          complete: event.loaded,
          status: "running",
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader("ETag");
        if (!etag) {
          partState.error = `ETAG missing on part upload: ${partState.part.meta.part_number}`;
          partState.state = "failed";
          reject({
            code: "ETAG_MISSING",
            message: `ETAG missing on part upload: ${partState.part.meta.part_number}`,
            retryable: true,
            details: xhr,
          });
        } else {
          partState.part.etag = etag;
          partState.etag = etag;
          partState.state = "complete";
          // TODO: Add a type guard here
          resolve([upload, partState as CompletePartState]);
        }
      } else {
        partState.error = `HTTP error: ${xhr.status}`;
        partState.state = "failed";
        reject({
          code: "UPLOAD_FAILED",
          message: `HTTP error: ${xhr.status}`,
          retryable: true,
          details: xhr,
        });
      }
    };

    xhr.onerror = () => {
      partState.error = "Network error";
      partState.state = "failed";
      reject({
        code: "UPLOAD_FAILED",
        message: "Network error",
        retryable: true,
        details: xhr,
      });
    };

    xhr.open("PUT", partState.part.meta.url);
    xhr.setRequestHeader("Content-MD5", partState.checksum);
    xhr.send(partState.part.payload);
  }
  return promise;
}

async function doPartUploads(props: {
  upload: PreparedUpload;
  MPU: MultipartUpload;
}): Promise<(UploadPartError | [PreparedUpload, CompletePartState])[]> {
  const uploadPartNodes = props.upload.partStates.map((partState) => {
    const inputNode = new GraphNode<
      unknown,
      {
        upload: PreparedUpload;
        partNumber: number;
        MPU: MultipartUpload;
      }
    >(async () => {
      return {
        upload: props.upload,
        partNumber: partState.part.meta.part_number,
        MPU: props.MPU,
      };
    });

    const uploadPartNode = new GraphNode<
      {
        upload: PreparedUpload;
        partNumber: number;
        MPU: MultipartUpload;
      },
      UploadPartError | [PreparedUpload, CompletePartState]
    >(uploadPart);

    GraphNode.soloLink(inputNode, uploadPartNode);
    return uploadPartNode;
  });

  const outputs = uploadPartNodes.map((node) => {
    return new GraphExecutor(node).executeGraph();
  });

  return Promise.all(outputs);
}

const isUploadPartError = (e: unknown): e is UploadPartError =>
  e instanceof Object && "code" in e;

// TODO: This could be removed if the uploadPart function bubbled up the errors correctly
async function confirmPartsAreUploaded(
  uploadAndPartTuples: (UploadPartError | [PreparedUpload, CompletePartState])[]
): Promise<CompleteUpload> {
  const errors = uploadAndPartTuples.filter(isUploadPartError);
  if (errors.length > 0) {
    throw new Error(
      `Upload failed with errors: ${errors
        .map((e) => `${e.code}: ${e.message}`)
        .join(", ")}`
    );
  }

  // Confirm that all tuples are related to the same upload
  const uploadsMap = new Map<string, PreparedUpload>();
  const partStates: CompletePartState[] = [];
  uploadAndPartTuples
    .filter(
      (x): x is [PreparedUpload, CompletePartState] => !isUploadPartError(x)
    )
    .forEach((uNpT) => {
      const [preparedUpload, completePartState] = uNpT;
      if (!uploadsMap.has(preparedUpload.usermedia.uuid)) {
        uploadsMap.set(preparedUpload.usermedia.uuid, preparedUpload);
      }
      partStates.push(completePartState);
    });

  // Check that the uploads are related to the same upload handle
  // Refactor this, if it somepoint turns out that we want to have multiple uploads in the same batch
  if (uploadsMap.size !== 1) {
    throw new Error("Uploads are not related to the same upload handle");
  }
  const preparedUpload = uploadsMap.values().next().value;
  if (!preparedUpload) {
    throw new Error("No uploads found");
  }

  // Convert to a complete upload
  const completeUpload: CompleteUpload = {
    requestConfig: preparedUpload.requestConfig,
    usermedia: preparedUpload.usermedia,
    partStates: partStates,
  };
  return completeUpload;
}

async function finalizeUpload(
  upload: CompleteUpload
): Promise<FinalizedUpload> {
  upload.usermedia = await postUsermediaFinish({
    config: upload.requestConfig,
    params: {
      uuid: upload.usermedia.uuid,
    },
    data: {
      parts: upload.partStates.map((ps) => {
        return {
          ETag: ps.etag,
          PartNumber: ps.part.meta.part_number,
        };
      }),
    },
    queryParams: {},
    useSession: true,
  });
  if (upload.usermedia.status !== "upload_complete") {
    throw new Error("Upload failed");
  } else {
    return upload as FinalizedUpload;
  }
}
