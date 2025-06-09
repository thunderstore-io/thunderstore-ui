import { GraphExecutor, GraphNode } from "..";
import { vi, describe, it, expect } from "vitest";

describe("GraphExecutor", () => {
  it("should cover resumeListener branch for shouldExecuteEvent === true", async () => {
    let resolveAction: ((value?: unknown) => void) | undefined;
    let callCount = 0;
    const node = new GraphNode<unknown, number>(async () => {
      callCount++;
      // Block the first time, resolve on second call
      if (callCount === 1) {
        await new Promise((resolve) => {
          resolveAction = resolve;
        });
      }
      return 1;
    });
    const executor = new GraphExecutor(node);
    // Start execution (will block in node)
    const execPromise = executor.executeGraph();
    // Wait for listener to be set up
    await new Promise((resolve) => setTimeout(resolve, 10));
    // Emit resume event while execution is blocked
    executor.onShouldExecuteChange.emit(true);
    // Unblock the node
    if (resolveAction) resolveAction();
    // Await the result (should be 1)
    const result = await execPromise;
    expect(result).toBe(1);
    // The node should have been called twice (once for each executeGraph)
    expect(callCount).toBe(2);
  });
  it("should not add a second resumeListener if one already exists", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    const executor = new GraphExecutor(node);

    // Manually add a resumeListener
    let called = false;
    // @ts-expect-error: test private
    executor.resumeListener = () => {
      called = true;
    };

    // Call executeGraph, which should not overwrite the existing resumeListener
    const promise = executor.executeGraph();
    // Wait a tick to ensure the function runs
    await new Promise((resolve) => setTimeout(resolve, 10));
    // Emit the event, which should call our manual listener
    executor.onShouldExecuteChange.emit(true);
    // Wait for the promise to resolve
    await promise;
    expect(called).toBe(true);
  });
  it("crawlNodes should traverse all nodes in a multi-layer graph", async () => {
    //  input1   input2
    //     \     /
    //   intermediate
    //        |
    //     output
    const inputNode1 = new GraphNode<unknown, number>(async () => 1);
    const inputNode2 = new GraphNode<unknown, number>(async () => 2);
    const intermediate = new GraphNode<number[], number>(async (args) =>
      args.reduce((a, b) => a + b, 0)
    );
    const outputNode = new GraphNode<number, number>(async (arg) => arg * 2);
    GraphNode.multiLink(inputNode1, intermediate);
    GraphNode.multiLink(inputNode2, intermediate);
    GraphNode.soloLink(intermediate, outputNode);
    const executor = new GraphExecutor(outputNode);
    // @ts-expect-error: access private for test
    await executor.crawlNodes();
    // @ts-expect-error: access private for test
    expect(executor.nodes.length).toBe(3);
  });

  it("executeNextNodes should reject if onShouldExecuteChange emits false", async () => {
    // Use a node that will not resolve immediately, so we can emit the event in time
    let resolveAction: ((value?: unknown) => void) | undefined;
    const node = new GraphNode<unknown, number>(async () => {
      await new Promise((resolve) => {
        resolveAction = resolve;
      });
      return 1;
    });
    const executor = new GraphExecutor(node);
    // @ts-expect-error: access private for test
    executor.nodes = [];
    // @ts-expect-error: access private for test
    const promise = executor.executeNextNodes();
    // Give the promise a tick to start, then emit stop
    setTimeout(() => {
      executor.onShouldExecuteChange.emit(false);
      if (resolveAction) resolveAction();
    }, 10);
    await expect(promise).rejects.toThrow("Execution stopped by user.");
  });

  it("should not crawl nodes if outputNode has no backwardEdges", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    const executor = new GraphExecutor(node);
    // @ts-expect-error: access private for test
    await executor.crawlNodes();
    // @ts-expect-error: access private for test
    expect(executor.nodes.length).toBe(0);
  });

  it("should not execute if output is already set", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    // Pre-set output
    // @ts-expect-error: access private for test
    node._output = 42;
    const executor = new GraphExecutor(node);
    const result = await executor.executeGraph();
    expect(result).toBe(42);
  });

  it("resumeListener should resume execution when event emits true", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    const executor = new GraphExecutor(node);
    // Start execution in background
    const execPromise = executor.executeGraph();
    // Wait for resumeListener to be set up
    await new Promise((resolve) => setTimeout(resolve, 10));
    executor.onShouldExecuteChange.emit(true);
    const result = await execPromise;
    expect(result).toBe(1);
  });

  it("stopExecution emits false", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    const executor = new GraphExecutor(node);
    let called = false;
    executor.onShouldExecuteChange.addListener((val) => {
      if (val === false) called = true;
    });
    await executor.stopExecution();
    expect(called).toBe(true);
  });

  it("resumeExecution emits true", async () => {
    const node = new GraphNode<unknown, number>(async () => 1);
    const executor = new GraphExecutor(node);
    let called = false;
    executor.onShouldExecuteChange.addListener((val) => {
      if (val === true) called = true;
    });
    await executor.resumeExecution();
    expect(called).toBe(true);
  });
  describe("event emitters and control", () => {
    it("should emit onGraphComplete when graph finishes", async () => {
      const outputNode = new GraphNode<unknown, number>(async () => 42);
      const executor = new GraphExecutor(outputNode);
      const completeSpy = vi.fn();
      executor.onGraphComplete.addListener(completeSpy);
      await executor.executeGraph();
      expect(completeSpy).toHaveBeenCalledWith(42);
    });

    it("should stop execution when onShouldExecuteChange emits false", async () => {
      const outputNode = new GraphNode<unknown, number>(async () => 1);
      const executor = new GraphExecutor(outputNode);
      const stopPromise = executor.stopExecution();
      await expect(stopPromise).resolves.toBeUndefined();
    });

    it("should resume execution when onShouldExecuteChange emits true", async () => {
      const outputNode = new GraphNode<unknown, number>(async () => 1);
      const executor = new GraphExecutor(outputNode);
      const resumePromise = executor.resumeExecution();
      await expect(resumePromise).resolves.toBeUndefined();
    });

    it("should throw if stopped during execution", async () => {
      const outputNode = new GraphNode<unknown, number>(async () => 1);
      const executor = new GraphExecutor(outputNode);
      // Use a hack to set private stopped property
      executor["stopped"] = true;
      await expect(executor.executeGraph()).rejects.toThrow(
        "Execution stopped by user."
      );
    });
  });
  describe("executeGraph", () => {
    it("should execute a graph with outputNode only", async () => {
      const outputNode = new GraphNode<unknown, number>(async () => {
        return 5 * 2;
      });

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(10);
    });

    it("should execute a simple linear graph", async () => {
      const inputNode = new GraphNode<unknown, number>(async () => 5);
      const outputNode = new GraphNode<number, number>(async (arg) => {
        return arg * 2;
      });

      GraphNode.soloLink(inputNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(10);
    });

    it("should execute a graph with multiple inputs", async () => {
      const inputNode1 = new GraphNode<unknown, number>(async () => 5);
      const inputNode2 = new GraphNode<unknown, number>(async () => 10);
      const outputNode = new GraphNode<number[], number>(async (args) =>
        args.reduce((a, b) => a + b, 0)
      );

      GraphNode.multiLink(inputNode1, outputNode);
      GraphNode.multiLink(inputNode2, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(15);
    });

    it("should execute a complex graph with multiple nodes", async () => {
      const inputNode1 = new GraphNode<unknown, number>(async () => 5);
      const inputNode2 = new GraphNode<unknown, number>(async () => 10);
      const intermediateNode = new GraphNode<number[], number>(async (args) =>
        args.reduce((a, b) => a + b, 0)
      );
      const outputNode = new GraphNode<number, number>(async (arg) => arg * 2);

      GraphNode.multiLink(inputNode1, intermediateNode);
      GraphNode.multiLink(inputNode2, intermediateNode);
      GraphNode.soloLink(intermediateNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(30);
    });

    it("should handle async operations in nodes", async () => {
      const inputNode = new GraphNode<unknown, number>(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return 5;
      });
      const outputNode = new GraphNode<number, number>(async (arg) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return arg * 2;
      });

      GraphNode.soloLink(inputNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(10);
    });
  });
});
