import { GraphNode } from "..";
import { describe, it, expect } from "vitest";

describe("GraphNode", () => {
  describe("soloLink", () => {
    it("should link two nodes with an edge", () => {
      const sourceNode = new GraphNode<unknown, number>(async () => 5);
      const targetNode = new GraphNode<number, unknown>(async () => 0);

      GraphNode.soloLink(sourceNode, targetNode);

      expect(sourceNode["forwardEdges"].length).toBe(1);
      expect(sourceNode["forwardEdges"][0].source).toBe(sourceNode);
      expect(sourceNode["forwardEdges"][0].target).toBe(targetNode);
      expect(targetNode["backwardEdges"].length).toBe(1);
      expect(targetNode["backwardEdges"][0].source).toBe(sourceNode);
      expect(targetNode["backwardEdges"][0].target).toBe(targetNode);
    });
  });

  describe("collectInputs", () => {
    it("should return null when some inputs are undefined", () => {
      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 0);
      const targetNode = new GraphNode<number[], unknown>(async () => 0);

      GraphNode.multiLink(sourceNode1, targetNode);
      GraphNode.multiLink(sourceNode2, targetNode);

      const inputs = GraphNode.collect(targetNode["backwardEdges"]);
      expect(inputs).toBeNull();
    });

    it("should return inputs when all are defined", async () => {
      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 10);
      const targetNode = new GraphNode<number[], unknown>(async () => 0);

      GraphNode.multiLink(sourceNode1, targetNode);
      GraphNode.multiLink(sourceNode2, targetNode);

      await sourceNode1.execute();
      await sourceNode2.execute();

      const inputs = GraphNode.collect(targetNode["backwardEdges"]);
      expect(inputs).toEqual({ 0: 5, 1: 10 });
    });
  });

  describe("execute", () => {
    it("should execute the node's action with single input as value", async () => {
      const action = async (arg: number) => arg * 2;
      const node = new GraphNode<number, number>(action);

      const sourceNode = new GraphNode<unknown, number>(async () => 5);
      GraphNode.soloLink(sourceNode, node);

      await sourceNode.execute();
      const result = await node.execute();
      expect(result).toBe(10);
    });

    it("should execute the node's action with multiple inputs as array", async () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number[], number>(action);

      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 10);

      GraphNode.multiLink(sourceNode1, node);
      GraphNode.multiLink(sourceNode2, node);

      await sourceNode1.execute();
      await sourceNode2.execute();

      const result = await node.execute();
      expect(result).toBe(15);
    });

    it("should throw error when inputs are not ready", async () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number[], number>(action);

      const sourceNode = new GraphNode<unknown, number>(async () => 0);
      GraphNode.multiLink(sourceNode, node);

      await expect(node.execute()).rejects.toThrow(
        "Node inputs aren't yet ready!"
      );
    });

    it("should return cached output when already executed", async () => {
      const action = async (arg: number) => arg * 2;
      const node = new GraphNode<number, number>(action);

      const sourceNode = new GraphNode<unknown, number>(async () => 5);
      GraphNode.soloLink(sourceNode, node);

      await sourceNode.execute();
      const firstResult = await node.execute();
      const secondResult = await node.execute();

      expect(firstResult).toBe(10);
      expect(secondResult).toBe(10);
    });
  });

  describe("shouldExecute", () => {
    it("should return true when inputs are ready and output is undefined", async () => {
      const node = new GraphNode<number, number>(async (arg) => arg);
      const sourceNode = new GraphNode<unknown, number>(async () => 5);

      GraphNode.soloLink(sourceNode, node);
      await sourceNode.execute();

      expect(node.shouldExecute).toBe(true);
    });

    it("should return false when output is already defined", async () => {
      const node = new GraphNode<number, number>(async (arg) => arg);
      const sourceNode = new GraphNode<unknown, number>(async () => 5);

      GraphNode.soloLink(sourceNode, node);
      await sourceNode.execute();
      await node.execute();

      expect(node.shouldExecute).toBe(false);
    });

    it("should return false when inputs are not ready", () => {
      const node = new GraphNode<number, number>(async (arg) => arg);
      const sourceNode = new GraphNode<unknown, number>(async () => 0);

      GraphNode.soloLink(sourceNode, node);

      expect(node.shouldExecute).toBe(false);
    });
  });
  // Removed unreachable and meaningless tests.
});
// Removed test that required patching static methods and type casting.
