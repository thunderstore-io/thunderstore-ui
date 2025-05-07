import {
  FinishedTask,
  PendingTask,
  StartedTask,
  TaskBase,
  TaskFinishReason,
  TaskStatus,
} from "./types";

/**
 * Creates a pending task.
 */
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

/**
 * Starts the task and returns a started task with a abort controller.
 */
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

/**
 * Waits for the task to finish and returns the result.
 *
 * If the tasks abort signal is triggered whilst the task is running, the task will not be interrupted.
 * The task will continue to run to completion and the promise will be fullfilled.
 *
 * If the task is aborted the resolve/reject of the promise will be an finished task with aborted status,
 * with the result or the error, depending on the outcome of the task.
 *
 * When creating tasks please keep in mind the possible maximum time of the task.
 *
 * TODO: Add a timeout or escape hatch to the task, so that the promise execution can be interrupted.
 *
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
 *
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)
 */
export async function waitTask<Args, Res>(
  task: StartedTask<Args, Res>
): Promise<FinishedTask<Args, Res>> {
  return task.result
    .then((r) => {
      if (task.controller.signal.aborted) {
        return {
          action: task.action,
          args: task.args,
          status: TaskStatus.FINISHED as const,
          finishReason: TaskFinishReason.ABORTED as const,
          abortReason: task.controller.signal.reason,
          result: r,
        };
      } else {
        return {
          action: task.action,
          args: task.args,
          status: TaskStatus.FINISHED as const,
          finishReason: TaskFinishReason.SUCCESS as const,
          result: r,
        };
      }
    })
    .catch((e) => {
      if (task.controller.signal.aborted) {
        return {
          action: task.action,
          args: task.args,
          status: TaskStatus.FINISHED as const,
          finishReason: TaskFinishReason.ABORTED as const,
          abortReason: task.controller.signal.reason,
          error: e,
        };
      } else {
        return {
          action: task.action,
          args: task.args,
          status: TaskStatus.FINISHED as const,
          finishReason: TaskFinishReason.ERROR as const,
          error: e,
        };
      }
    });
}

/**
 * Triggers the abort signal of the started task and returns the finished task.
 */
export function abortTask<Args, Res>(
  task: StartedTask<Args, Res>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reason?: any
): Promise<FinishedTask<Args, Res>> {
  task.controller.abort(reason);
  return waitTask<Args, Res>(task);
}

/**
 * Takes in a finished task, creates a new task with the same action and args and starts it.
 *
 * Pass the returned started task to waitTask to get the finished task.
 */
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
