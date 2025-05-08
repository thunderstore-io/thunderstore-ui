import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TaskFinishReason, TaskStatus } from "../types";
import { TaskManager } from "../taskManager";

describe("TaskManager", () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("tasks", () => {
    it("should get tasks", async () => {
      expect(taskManager.tasks.length).toBe(0);
      taskManager.createTask(async () => {}, {});
      taskManager.createTask(async () => {}, {});
      expect(taskManager.createdTasks.length).toBe(2);
    });
  });

  describe("taskPromises", () => {
    it("should get taskPromises", async () => {
      expect(taskManager.tasks.length).toBe(0);
      expect(taskManager.taskPromises.length).toBe(0);
      taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      expect(taskManager.tasks.length).toBe(4);
      expect(taskManager.taskPromises.length).toBe(2);
      await taskManager.resolveTaskPromises();
      expect(taskManager.tasks.length).toBe(6);
      expect(taskManager.taskPromises.length).toBe(2);
    });
  });

  describe("createdTasks", () => {
    it("should get tasks with PENDING status", async () => {
      expect(taskManager.createdTasks.length).toBe(0);
      taskManager.createTask(async () => {}, {});
      taskManager.createTask(async () => {}, {});
      expect(taskManager.createdTasks.length).toBe(2);
      expect(taskManager.createdTasks[0].status).toBe(TaskStatus.PENDING);
      expect(taskManager.createdTasks[1].status).toBe(TaskStatus.PENDING);
    });
  });

  describe("startedTasks", () => {
    it("should get tasks with STARTED status", async () => {
      expect(taskManager.startedTasks.length).toBe(0);
      taskManager.startTask(taskManager.createTask(async () => {}, {}));
      taskManager.startTask(taskManager.createTask(async () => {}, {}));
      expect(taskManager.startedTasks.length).toBe(2);
      expect(taskManager.startedTasks[0].status).toBe(TaskStatus.STARTED);
      expect(taskManager.startedTasks[1].status).toBe(TaskStatus.STARTED);
    });
  });

  describe("finishedTasks", () => {
    it("should get tasks with FINISHED status", async () => {
      expect(taskManager.finishedTasks.length).toBe(0);
      await taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      await taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      await taskManager.resolveTaskPromises();
      expect(taskManager.finishedTasks.length).toBe(2);
      expect(taskManager.finishedTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.finishedTasks[1].status).toBe(TaskStatus.FINISHED);
    });
  });

  describe("abortedTasks", () => {
    it("should get tasks with FINISHED status and ABORTED finish reason", async () => {
      expect(taskManager.abortedTasks.length).toBe(0);
      const startedTask1 = taskManager.startTask(
        taskManager.createTask(async () => {
          throw new Error("test error 1");
        }, {})
      );
      startedTask1.controller.abort();
      const startedTask2 = taskManager.startTask(
        taskManager.createTask(async () => {
          throw new Error("test error 2");
        }, {})
      );
      startedTask2.controller.abort();

      await taskManager.waitTask(startedTask1);
      await taskManager.waitTask(startedTask2);
      await taskManager.resolveTaskPromises();
      expect(taskManager.abortedTasks.length).toBe(2);
      expect(taskManager.abortedTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.abortedTasks[0].finishReason).toBe(
        TaskFinishReason.ABORTED
      );
      expect(taskManager.abortedTasks[1].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.abortedTasks[1].finishReason).toBe(
        TaskFinishReason.ABORTED
      );
    });
  });

  describe("erroredUploadPartTasks", () => {
    it("should get tasks with FINISHED status and ERROR finish reason", async () => {
      expect(taskManager.erroredTasks.length).toBe(0);

      await taskManager.waitTask(
        taskManager.startTask(
          taskManager.createTask(async () => {
            throw new Error("test error 1");
          }, {})
        )
      );
      await taskManager.waitTask(
        taskManager.startTask(
          taskManager.createTask(async () => {
            throw new Error("test error 2");
          }, {})
        )
      );
      await taskManager.resolveTaskPromises();
      expect(taskManager.erroredTasks.length).toBe(2);
      expect(taskManager.erroredTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.erroredTasks[0].finishReason).toBe(
        TaskFinishReason.ERROR
      );
      expect(taskManager.erroredTasks[1].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.erroredTasks[1].finishReason).toBe(
        TaskFinishReason.ERROR
      );
    });
  });

  describe("successfulUploadPartTasks", () => {
    it("should get tasks with FINISHED status and SUCCESS finish reason", async () => {
      expect(taskManager.successfulTasks.length).toBe(0);
      await taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      await taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      await taskManager.resolveTaskPromises();
      expect(taskManager.successfulTasks.length).toBe(2);
      expect(taskManager.successfulTasks[0].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.successfulTasks[0].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
      expect(taskManager.successfulTasks[1].status).toBe(TaskStatus.FINISHED);
      expect(taskManager.successfulTasks[1].finishReason).toBe(
        TaskFinishReason.SUCCESS
      );
    });
  });

  describe("resolveTaskPromises", () => {
    it("should resolve promises in _tasks and add the resolved tasks to _tasks", async () => {
      expect(taskManager.tasks.length).toBe(0);
      expect(taskManager.taskPromises.length).toBe(0);
      const task1 = taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      const task2 = taskManager.waitTask(
        taskManager.startTask(taskManager.createTask(async () => {}, {}))
      );
      expect(taskManager.tasks.length).toBe(4);
      expect(taskManager.taskPromises.length).toBe(2);
      expect(taskManager.taskPromises[0]).toBe(task1);
      expect(taskManager.taskPromises[1]).toBe(task2);
      await taskManager.resolveTaskPromises();
      expect(taskManager.tasks[4]).toBe(await task1);
      expect(taskManager.tasks[5]).toBe(await task2);
      expect(taskManager.tasks.length).toBe(6);
      expect(taskManager.taskPromises.length).toBe(2);
    });
  });

  describe("createTask", () => {
    it("should create a task and add it to the task manager tasks array", () => {
      const task = taskManager.createTask(async () => {}, {});
      expect(taskManager.tasks.length).toBe(1);
      expect(taskManager.tasks[0]).toBe(task);
    });
  });

  describe("startTask", () => {
    it("should start a task and add it to the task manager tasks array", () => {
      const task = taskManager.createTask(async () => {}, {});
      const startedTask = taskManager.startTask(task);
      expect(startedTask.status).toBe(TaskStatus.STARTED);
      expect(taskManager.tasks.length).toBe(2);
      expect(taskManager.tasks[1]).toBe(startedTask);
    });
  });

  describe("waitTask", () => {
    it("should return a promise that resolves when a task finishes and add the promise to the task manager taskPromises array", async () => {
      const task = taskManager.createTask(async () => {}, {});
      const startedTask = taskManager.startTask(task);
      const finishedTaskPromise = taskManager.waitTask(startedTask);
      const finishedTask = await finishedTaskPromise;
      expect(taskManager.taskPromises.length).toBe(1);
      expect(taskManager.taskPromises[0]).toBe(finishedTaskPromise);
      // For good measure also test promise resolution
      await taskManager.resolveTaskPromises();
      const finishedTasks = taskManager.finishedTasks;
      expect(finishedTasks.length).toBe(1);
      expect(finishedTasks[0]).toBe(finishedTask);
    });
  });

  describe("restartTask", () => {
    it("should restart a task and add it to the task manager tasks array", async () => {
      const task = taskManager.createTask(async () => {}, {});
      const startedTask = taskManager.startTask(task);
      const finishedTask = taskManager.waitTask(startedTask);
      const restartedTask = taskManager.restartTask(await finishedTask);
      expect(restartedTask.status).toBe(TaskStatus.STARTED);
      expect(taskManager.taskPromises.length).toBe(1);
      expect(taskManager.taskPromises[0]).toBe(finishedTask);
      expect(taskManager.tasks.length).toBe(3);
      expect(taskManager.tasks[2]).toBe(restartedTask);
    });
  });

  describe("abortTask", () => {
    it("should abort a task and add it to the task manager tasks array", async () => {
      const task = taskManager.createTask(async () => {}, {});
      const startedTask = taskManager.startTask(task);
      const abortedTaskPromise = taskManager.abortTask(startedTask);
      const abortedTask = await abortedTaskPromise;
      expect(abortedTask.status).toBe(TaskStatus.FINISHED);
      expect(taskManager.taskPromises.length).toBe(1);
      expect(taskManager.taskPromises[0]).toBe(abortedTaskPromise);
      await taskManager.resolveTaskPromises();
      expect(taskManager.tasks.length).toBe(3);
      expect(taskManager.tasks[2]).toBe(abortedTask);
    });
  });
});
