import { describe, it, expect } from "vitest";
import {
  createTask,
  startTask,
  waitTask,
  abortTask,
  restartTask,
} from "../task";
import { TaskStatus, TaskFinishReason } from "../types";

describe("Task Module", () => {
  let action: (args: number) => Promise<number>;
  let args: number;

  beforeEach(() => {
    action = async (args: number) => args * 2;
    args = 5;
  });

  describe("createTask", () => {
    it("should create a pending task with the provided action and args", () => {
      const task = createTask(action, args);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.action).toBe(action);
      expect(task.args).toBe(args);
    });
  });

  describe("startTask", () => {
    it("should start a pending task and return a started task with correct properties", () => {
      const pendingTask = createTask(action, args);
      const startedTask = startTask(pendingTask);

      expect(startedTask.action).toBe(action);
      expect(startedTask.args).toBe(args);
      expect(startedTask.status).toBe(TaskStatus.STARTED);
      expect(startedTask.controller).toBeInstanceOf(AbortController);
      expect(startedTask.result).toBeInstanceOf(Promise);
    });
  });

  describe("waitTask", () => {
    it("should create a task and resolve to a finished task with success when the action succeeds", async () => {
      const startedTask = startTask(createTask(action, args));
      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.SUCCESS);
      expect(finishedTask).toHaveProperty("result");
      expect(finishedTask).not.toHaveProperty("abortReason");
      expect(finishedTask).not.toHaveProperty("error");

      if (finishedTask.finishReason === TaskFinishReason.SUCCESS) {
        expect(finishedTask.result).toBe(10);
      } else {
        throw new Error("Task has not finished with success");
      }
    });

    it("should resolve to a finished task with error when the action fails", async () => {
      const startedTask = startTask(
        createTask(async () => {
          throw new Error("Test error");
        }, {})
      );
      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ERROR);
      expect(finishedTask).not.toHaveProperty("result");
      expect(finishedTask).not.toHaveProperty("abortReason");
      expect(finishedTask).toHaveProperty("error");

      if (finishedTask.finishReason === TaskFinishReason.ERROR) {
        expect(finishedTask.error).toBeInstanceOf(Error);
        if (finishedTask.error instanceof Error) {
          expect(finishedTask.error.message).toBe("Test error");
        } else {
          throw new Error(
            "Task error property is not an instance of Error, when it should be"
          );
        }
      } else {
        throw new Error("Task has not finished with error");
      }
    });

    it("should resolve to a finished and aborted task when the task is aborted and the task doesn't throw", async () => {
      const action = async (args: number) => {
        return await new Promise((resolve) =>
          setTimeout(() => resolve(args * 2), 100)
        );
      };
      const startedTask = startTask(createTask(action, args));
      startedTask.controller.abort("Test abort");
      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ABORTED);
      expect(finishedTask).toHaveProperty("result");
      expect(finishedTask).toHaveProperty("abortReason");
      expect(finishedTask).not.toHaveProperty("error");

      if (
        finishedTask.finishReason === TaskFinishReason.ABORTED &&
        finishedTask.result
      ) {
        expect(finishedTask.result).toBe(10);
      } else {
        throw new Error("Task didn't resolve with a result");
      }

      if (
        finishedTask.finishReason === TaskFinishReason.ABORTED &&
        finishedTask.abortReason
      ) {
        expect(finishedTask.abortReason).toBe("Test abort");
      } else {
        throw new Error("Task has not finished with abortReason");
      }
    });

    it("should resolve to a finished and aborted task when the task is aborted and the task does throw", async () => {
      const action = async () => {
        throw new Error("Test error");
      };
      const startedTask = startTask(createTask(action, {}));
      startedTask.controller.abort("Test abort");
      const finishedTask = await waitTask(startedTask);

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ABORTED);
      expect(finishedTask).not.toHaveProperty("result");
      expect(finishedTask).toHaveProperty("abortReason");
      expect(finishedTask).toHaveProperty("error");

      if (
        finishedTask.finishReason === TaskFinishReason.ABORTED &&
        finishedTask.error
      ) {
        expect(finishedTask.error).toBeInstanceOf(Error);
        if (finishedTask.error instanceof Error) {
          expect(finishedTask.error.message).toBe("Test error");
        } else {
          throw new Error("Task error property is not an instance of Error");
        }
      } else {
        throw new Error("Task has not finished with error");
      }

      if (
        finishedTask.finishReason === TaskFinishReason.ABORTED &&
        finishedTask.abortReason
      ) {
        expect(finishedTask.abortReason).toBe("Test abort");
      } else {
        throw new Error("Task has not finished with abortReason");
      }
    });
  });

  describe("abortTask", () => {
    it("should abort a started task and return a finished task", async () => {
      const startedTask = startTask(createTask(action, args));
      const finishedTask = await abortTask(startedTask, "Test abort");

      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.ABORTED);

      if (finishedTask.finishReason === TaskFinishReason.ABORTED) {
        expect(finishedTask.abortReason).toBe("Test abort");
      } else {
        throw new Error("Task has not finished with abortReason");
      }
    });
  });

  describe("restartTask", () => {
    it("should create a new started task from a finished task", () => {
      const finishedTask = {
        status: TaskStatus.FINISHED as const,
        action,
        args,
        finishReason: TaskFinishReason.SUCCESS as const,
        result: 10,
      };
      const restartedTask = restartTask(finishedTask);

      expect(restartedTask.action).toBe(finishedTask.action);
      expect(restartedTask.args).toBe(finishedTask.args);
      expect(restartedTask.status).toBe(TaskStatus.STARTED);
      expect(restartedTask.controller).toBeInstanceOf(AbortController);
      expect(restartedTask.result).toBeInstanceOf(Promise);
    });
  });
});
