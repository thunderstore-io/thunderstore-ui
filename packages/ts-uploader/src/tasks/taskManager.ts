/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  abortTask,
  createTask,
  restartTask,
  startTask,
  waitTask,
} from "./task";
import {
  FinishedTask,
  PendingTask,
  StartedTask,
  Task,
  TaskAction,
  TaskFinishReason,
  TaskStatus,
} from "./types";

export class TaskManager {
  tasks: Task<any, any>[] = [];

  constructor(initialTasks?: Task<any, any>[]) {
    this.tasks = initialTasks ?? [];
  }

  get createdTasks() {
    return this.tasks.filter((task) => task.status === TaskStatus.PENDING);
  }

  get startedTasks() {
    return this.tasks.filter((task) => task.status === TaskStatus.STARTED);
  }

  get finishedTasks(): FinishedTask<any, any>[] {
    return this.tasks.filter(
      (task) =>
        task.status === TaskStatus.FINISHED &&
        (task.finishReason === TaskFinishReason.ABORTED ||
          task.finishReason === TaskFinishReason.ERROR ||
          task.finishReason === TaskFinishReason.SUCCESS)
    );
  }

  get abortedTasks() {
    return this.finishedTasks.filter(
      (task) => task.finishReason === TaskFinishReason.ABORTED
    );
  }

  get erroredTasks() {
    return this.finishedTasks.filter(
      (task) => task.finishReason === TaskFinishReason.ERROR
    );
  }

  get successfulTasks() {
    return this.finishedTasks.filter(
      (task) => task.finishReason === TaskFinishReason.SUCCESS
    );
  }

  createTask(action: TaskAction<any, any>, args: any) {
    const task = createTask(action, args);
    this.tasks.push(task);
    return task;
  }

  startTask(task: PendingTask<any, any>) {
    const startedTask = startTask(task);
    this.tasks.push(startedTask);
    return startedTask;
  }

  waitTask(task: StartedTask<any, any>) {
    const finishedTask = waitTask(task);
    finishedTask.then((t) => {
      this.tasks.push(t);
    });
    return finishedTask;
  }

  restartTask(task: FinishedTask<any, any>) {
    const restartedTask = restartTask(task);
    this.tasks.push(restartedTask);
    return restartedTask;
  }

  abortTask(task: StartedTask<any, any>) {
    const abortedTask = abortTask(task);
    abortedTask.then((t) => {
      this.tasks.push(t);
    });
    return abortedTask;
  }
}
