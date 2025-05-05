import {
  FinishedTask,
  PendingTask,
  StartedTask,
  TaskBase,
  TaskFinishReason,
  TaskStatus,
} from "./types";

export function createTask<Args, Res>(
  action: TaskBase<Args, Res>["action"],
  args: Args
): PendingTask<Args, Res> {
  return {
    status: TaskStatus.PENDING,
    action,
    args,
  };
}

export function startTask<Args, Res>(
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

export async function waitTask<Args, Res>(
  task: StartedTask<Args, Res>
): Promise<FinishedTask<Args, Res>> {
  try {
    // TODO: If task is aborted whilst promise is running, the promise will not
    // be rejected. Probably fix that somehow.
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

export function abortTask<Args, Res>(
  task: StartedTask<Args, Res>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reason?: any
): Promise<FinishedTask<Args, Res>> {
  task.controller.abort(reason);
  return waitTask<Args, Res>(task);
}

export function restartTask<Args, Res>(
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
