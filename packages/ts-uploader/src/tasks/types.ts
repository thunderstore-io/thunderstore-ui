export enum TaskStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
}

export enum TaskFinishReason {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  ABORTED = "ABORTED",
}

export type TaskAction<Args, Res> = (
  args: Args,
  controller: AbortController
) => Promise<Res>;
export type TaskBase<Args, Res> = {
  args: Args;
  action: TaskAction<Args, Res>;
};

export type AbortedTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.FINISHED;
  finishReason: TaskFinishReason.ABORTED;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abortReason?: any;
};
export type ErroredTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.FINISHED;
  finishReason: TaskFinishReason.ERROR;
  error: Error | unknown;
};
export type SuccesfulTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.FINISHED;
  finishReason: TaskFinishReason.SUCCESS;
  result: Res;
};

export type PendingTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.PENDING;
};
export type StartedTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.STARTED;
  controller: AbortController;
  result: Promise<Res>;
};

export type FinishedTask<Args, Res> =
  | AbortedTask<Args, Res>
  | ErroredTask<Args, Res>
  | SuccesfulTask<Args, Res>;

export type Task<Args, Res> =
  | PendingTask<Args, Res>
  | StartedTask<Args, Res>
  | FinishedTask<Args, Res>;

// export type TaskBundle = {
//   tasks: Task<unknown, unknown>[];
//   onAllFinished: () => void;
// };

// export interface IBaseTaskManager {
//   get tasks(): Task<unknown, unknown>[];
//   get finishedTasks(): FinishedTask<unknown, unknown>[];

//   addTask(task: Task<unknown, unknown>): void;
//   addTaskBundle(taskBundle: TaskBundle): void;
// }
