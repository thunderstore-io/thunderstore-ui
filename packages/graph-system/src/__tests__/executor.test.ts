import { GraphExecutor, GraphNode } from "..";

describe("GraphExecutor", () => {
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
      const outputNode = new GraphNode<number, number>(async (args) => {
        return args[0] * 2;
      });

      GraphNode.linkNodes(inputNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(10);
    });

    it("should execute a graph with multiple inputs", async () => {
      const inputNode1 = new GraphNode<unknown, number>(async () => 5);
      const inputNode2 = new GraphNode<unknown, number>(async () => 10);
      const outputNode = new GraphNode<number, number>(async (args) =>
        args.reduce((a, b) => a + b, 0)
      );

      GraphNode.linkNodes(inputNode1, outputNode);
      GraphNode.linkNodes(inputNode2, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(15);
    });

    it("should execute a complex graph with multiple nodes", async () => {
      const inputNode1 = new GraphNode<unknown, number>(async () => 5);
      const inputNode2 = new GraphNode<unknown, number>(async () => 10);
      const intermediateNode = new GraphNode<number, number>(async (args) =>
        args.reduce((a, b) => a + b, 0)
      );
      const outputNode = new GraphNode<number, number>(
        async (args) => args[0] * 2
      );

      GraphNode.linkNodes(inputNode1, intermediateNode);
      GraphNode.linkNodes(inputNode2, intermediateNode);
      GraphNode.linkNodes(intermediateNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(30);
    });

    it("should handle async operations in nodes", async () => {
      const inputNode = new GraphNode<unknown, number>(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return 5;
      });
      const outputNode = new GraphNode<number, number>(async (args) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return args[0] * 2;
      });

      GraphNode.linkNodes(inputNode, outputNode);

      const executor = new GraphExecutor(outputNode);
      const result = await executor.executeGraph();

      expect(result).toBe(10);
    });
  });
});
