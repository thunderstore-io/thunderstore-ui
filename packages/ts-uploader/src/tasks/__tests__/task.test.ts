import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTask,
  startTask,
  waitTask,
  abortTask,
  restartTask,
} from "../task";
import { TaskStatus, TaskFinishReason } from "../types";

describe("Task Module", () => {
  describe("createTask", () => {
    it("should create a pending task with the provided action and args", () => {
      const action = (args: number) => Promise.resolve(args * 2);
      const args = 5;

      const task = createTask(action, args);

      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.action).toBe(action);
      expect(task.args).toBe(args);
    });
  });

  describe("startTask", () => {
    it("should start a pending task and return a started task", () => {
      const action = (args: number) => Promise.resolve(args * 2);
      const args = 5;
      const pendingTask = createTask(action, args);

      const startedTask = startTask(pendingTask);

      expect(startedTask.status).toBe(TaskStatus.STARTED);
      expect(startedTask.controller).toBeDefined();
      expect(startedTask.result).toBeInstanceOf(Promise);
    });
  });

  describe("waitTask", () => {
    it("should resolve to a finished task with success when the action succeeds", async () => {
      const action = (args: number) => Promise.resolve(args * 2);
      const args = 5;
      const startedTask = startTask(createTask(action, args));

      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.SUCCESS);
      expect(finishedTask.result).toBe(10);
    });

    it("should resolve to a finished task with error when the action fails", async () => {
      const action = (args: number) => Promise.reject(new Error("Test error"));
      const args = 5;
      const startedTask = startTask(createTask(action, args));

      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ERROR);
      expect(finishedTask.error).toBeInstanceOf(Error);
    });

    it("should resolve to a finished task with aborted when the task is aborted", async () => {
      const action = (args: number) =>
        new Promise((resolve) => setTimeout(() => resolve(args * 2), 100));
      const args = 5;
      const startedTask = startTask(createTask(action, args));

      startedTask.controller.abort("Test abort");
      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ABORTED);
      expect(finishedTask.abortReason).toBe("Test abort");
    });
  });

  describe("abortTask", () => {
    it("should abort a started task and return a finished task", async () => {
      const action = (args: number) =>
        new Promise((resolve) => setTimeout(() => resolve(args * 2), 100));
      const args = 5;
      const startedTask = startTask(createTask(action, args));

      const finishedTask = await abortTask(startedTask, "Test abort");

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ABORTED);
      expect(finishedTask.abortReason).toBe("Test abort");
    });
  });

  describe("restartTask", () => {
    it("should create a new started task from a finished task", () => {
      const action = (args: number) => Promise.resolve(args * 2);
      const args = 5;
      const finishedTask = {
        status: TaskStatus.FINISHED,
        action,
        args,
        finishReason: TaskFinishReason.SUCCESS,
        result: 10,
      };

      const restartedTask = restartTask(finishedTask);

      expect(restartedTask.status).toBe(TaskStatus.STARTED);
      expect(restartedTask.controller).toBeDefined();
      expect(restartedTask.result).toBeInstanceOf(Promise);
    });
  });
});
