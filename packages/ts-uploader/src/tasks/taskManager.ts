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
  _tasks: (Task<any, any> | Promise<Task<any, any>>)[] = [];

  constructor(initialTasks?: Task<any, any>[]) {
    this._tasks = initialTasks ? initialTasks : [];
  }

  get tasks(): Task<any, any>[] {
    return this._tasks.filter(
      (task) => typeof task === "object" && "status" in task
    );
  }

  set tasks(tasks: (Task<any, any> | Promise<Task<any, any>>)[]) {
    this._tasks.push(...tasks);
  }

  get taskPromises(): Promise<Task<any, any>>[] {
    return this._tasks.filter(
      (task) =>
        typeof task === "object" &&
        "then" in task &&
        "catch" in task &&
        "finally" in task
    );
  }

  get createdTasks() {
    return this._tasks.filter(
      (task) =>
        typeof task === "object" &&
        "status" in task &&
        task.status === TaskStatus.PENDING
    );
  }

  get startedTasks() {
    return this._tasks.filter(
      (task) =>
        typeof task === "object" &&
        "status" in task &&
        task.status === TaskStatus.STARTED
    );
  }

  get finishedTasks(): FinishedTask<any, any>[] {
    return this._tasks.filter(
      (task) =>
        typeof task === "object" &&
        "status" in task &&
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

  // TODO: Ensure no duplicates are added to the _tasks array
  async resolveTaskPromises() {
    await Promise.all(
      this.taskPromises.map(async (promise) => {
        const task = await promise;
        this._tasks.push(task);
      })
    );
  }

  createTask(action: TaskAction<any, any>, args: any) {
    const task = createTask(action, args);
    this._tasks.push(task);
    return task;
  }

  startTask(task: PendingTask<any, any>) {
    const startedTask = startTask(task);
    this._tasks.push(startedTask);
    return startedTask;
  }

  waitTask(task: StartedTask<any, any>) {
    const finishedTask = waitTask(task);
    this._tasks.push(finishedTask);
    return finishedTask;
  }

  restartTask(task: FinishedTask<any, any>) {
    const restartedTask = restartTask(task);
    this._tasks.push(restartedTask);
    return restartedTask;
  }

  abortTask(task: StartedTask<any, any>) {
    const abortedTask = abortTask(task);
    this._tasks.push(abortedTask);
    return abortedTask;
  }
}
