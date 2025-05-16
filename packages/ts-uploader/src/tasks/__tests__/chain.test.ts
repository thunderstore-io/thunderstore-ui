import { describe, it, expect } from "vitest";
import { createTask, startTask, waitTask } from "../task";
import { TaskStatus, TaskFinishReason } from "../types";
import { chainActions } from "../chain";

describe("Chain Module", () => {
  describe("chainActions", () => {
    it("should call and await actions in order", async () => {
      const args = 5;
      const action1 = async (args: number) => args * 2;
      const action2 = async (args: number) => args * 2;

      const chainedAction = chainActions(action1, action2);

      const createdTask = createTask(chainedAction, args);
      const startedTask = startTask(createdTask);
      const taskPromise = waitTask(startedTask);
      const finishedTask = await taskPromise;
      expect(finishedTask.status).toBe(TaskStatus.FINISHED);
      expect(finishedTask.finishReason).toBe(TaskFinishReason.SUCCESS);
      if (finishedTask.finishReason === TaskFinishReason.SUCCESS) {
        expect(finishedTask.result).toBe(20);
      } else {
        throw new Error("Task didn't finnish successfully");
      }
    });
  });
});
