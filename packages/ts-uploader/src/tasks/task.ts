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

type TaskAction<Args, Res> = (
  args: Args,
  controller: AbortController
) => Promise<Res>;
type TaskBase<Args, Res> = {
  args: Args;
  action: TaskAction<Args, Res>;
};
export type PendingTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.PENDING;
};
export type StartedTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.STARTED;
  controller: AbortController;
  result: Promise<Res>;
};
export type AbortedTask<Args, Res> = TaskBase<Args, Res> & {
  status: TaskStatus.FINISHED;
  finishReason: TaskFinishReason.ABORTED;
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
export type FinishedTask<Args, Res> =
  | AbortedTask<Args, Res>
  | ErroredTask<Args, Res>
  | SuccesfulTask<Args, Res>;

export type Task<Args, Res> =
  | PendingTask<Args, Res>
  | StartedTask<Args, Res>
  | FinishedTask<Args, Res>;

function createTask<Args, Res>(
  action: TaskBase<Args, Res>["action"],
  args: Args
): PendingTask<Args, Res> {
  return {
    status: TaskStatus.PENDING,
    action,
    args,
  };
}

function startTask<Args, Res>(
  task: PendingTask<Args, Res>
): StartedTask<Args, Res> {
  const controller = new AbortController();
  return {
    ...task,
    status: TaskStatus.STARTED,
    controller,
    result: task.action(task.args, controller),
  };
}

async function waitTask<Args, Res>(
  task: StartedTask<Args, Res>
): Promise<FinishedTask<Args, Res>> {
  try {
    const result = await task.result;
    return {
      ...task,
      status: TaskStatus.FINISHED,
      finishReason: TaskFinishReason.SUCCESS,
      result: result,
    };
  } catch (e) {
    if (task.controller.signal.aborted) {
      return {
        ...task,
        status: TaskStatus.FINISHED,
        finishReason: TaskFinishReason.ABORTED,
        abortReason: task.controller.signal.reason,
      };
    } else {
      return {
        ...task,
        status: TaskStatus.FINISHED,
        finishReason: TaskFinishReason.ERROR,
        error: e,
      };
    }
  }
}

function abortTask<Args, Res>(
  task: StartedTask<Args, Res>,
  reason?: any
): Promise<FinishedTask<Args, Res>> {
  task.controller.abort(reason);
  return waitTask<Args, Res>(task);
}

function restartTask<Args, Res>(
  task: FinishedTask<Args, Res>
): StartedTask<Args, Res> {
  return startTask(createTask(task.action, task.args));
}

export const Tasks = {
  create: createTask,
  start: startTask,
  wait: waitTask,
  restart: restartTask,
  abort: abortTask,
};
