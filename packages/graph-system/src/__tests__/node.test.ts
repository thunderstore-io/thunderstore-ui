import { GraphNode } from "..";

describe("GraphNode", () => {
  describe("constructor", () => {
    it("should create a node with an action", () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number, number>(action);
      expect(node["action"]).toBe(action);
    });
  });

  describe("linkNodes", () => {
    it("should link two nodes with an edge", () => {
      const sourceNode = new GraphNode<unknown, number>(async () => 5);
      const targetNode = new GraphNode<number, unknown>(async () => 0);

      GraphNode.linkNodes(sourceNode, targetNode);

      expect(sourceNode["forwardEdges"].length).toBe(1);
      expect(sourceNode["forwardEdges"][0].source).toBe(sourceNode);
      expect(sourceNode["forwardEdges"][0].target).toBe(targetNode);
      expect(targetNode["backardEdges"].length).toBe(1);
      expect(targetNode["backardEdges"][0].source).toBe(sourceNode);
      expect(targetNode["backardEdges"][0].target).toBe(targetNode);
    });
  });

  describe("collectInputs", () => {
    it("should return null when some inputs are undefined", () => {
      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 0);
      const targetNode = new GraphNode<number, unknown>(async () => 0);

      GraphNode.linkNodes(sourceNode1, targetNode);
      GraphNode.linkNodes(sourceNode2, targetNode);

      const inputs = GraphNode.collectInputs(targetNode["backardEdges"]);
      expect(inputs).toBeNull();
    });

    it("should return inputs when all are defined", async () => {
      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 10);
      const targetNode = new GraphNode<number, unknown>(async () => 0);

      GraphNode.linkNodes(sourceNode1, targetNode);
      GraphNode.linkNodes(sourceNode2, targetNode);

      await sourceNode1.execute();
      await sourceNode2.execute();

      const inputs = GraphNode.collectInputs(targetNode["backardEdges"]);
      expect(inputs).toEqual([5, 10]);
    });
  });

  describe("execute", () => {
    it("should execute the node's action with inputs", async () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number, number>(action);

      const sourceNode1 = new GraphNode<unknown, number>(async () => 5);
      const sourceNode2 = new GraphNode<unknown, number>(async () => 10);

      GraphNode.linkNodes(sourceNode1, node);
      GraphNode.linkNodes(sourceNode2, node);

      await sourceNode1.execute();
      await sourceNode2.execute();

      const result = await node.execute();
      expect(result).toBe(15);
    });

    it("should throw error when inputs are not ready", async () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number, number>(action);

      const sourceNode = new GraphNode<unknown, number>(async () => 0);
      GraphNode.linkNodes(sourceNode, node);

      await expect(node.execute()).rejects.toThrow(
        "Node inputs aren't yet ready!"
      );
    });

    it("should return cached output when already executed", async () => {
      const action = async (args: number[]) => args.reduce((a, b) => a + b, 0);
      const node = new GraphNode<number, number>(action);

      const sourceNode = new GraphNode<unknown, number>(async () => 5);
      GraphNode.linkNodes(sourceNode, node);

      await sourceNode.execute();
      const firstResult = await node.execute();
      const secondResult = await node.execute();

      expect(firstResult).toBe(5);
      expect(secondResult).toBe(5);
    });
  });

  describe("shouldExecute", () => {
    it("should return true when inputs are ready and output is undefined", async () => {
      const node = new GraphNode<number, number>(async (args) => args[0]);
      const sourceNode = new GraphNode<unknown, number>(async () => 5);

      GraphNode.linkNodes(sourceNode, node);
      await sourceNode.execute();

      expect(node.shouldExecute).toBe(true);
    });

    it("should return false when output is already defined", async () => {
      const node = new GraphNode<number, number>(async (args) => args[0]);
      const sourceNode = new GraphNode<unknown, number>(async () => 5);

      GraphNode.linkNodes(sourceNode, node);
      await sourceNode.execute();
      await node.execute();

      expect(node.shouldExecute).toBe(false);
    });

    it("should return false when inputs are not ready", () => {
      const node = new GraphNode<number, number>(async (args) => args[0]);
      const sourceNode = new GraphNode<unknown, number>(async () => 0);

      GraphNode.linkNodes(sourceNode, node);

      expect(node.shouldExecute).toBe(false);
    });
  });
});
