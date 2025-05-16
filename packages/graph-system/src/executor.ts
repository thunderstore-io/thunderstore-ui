import { GraphNode } from ".";

export class GraphExecutor<OType> {
  private readonly nodes: GraphNode<unknown, unknown>[];
  private readonly outputNode: GraphNode<unknown, OType>;

  constructor(nodes: GraphNode<any, any>[], outputNode: GraphNode<any, OType>) {
    this.nodes = nodes;
    this.outputNode = outputNode;
  }

  private async executeNextNodes() {
    const promises = this.nodes
      .filter((x) => x.shouldExecute)
      .map((x) => x.execute());
    await Promise.all(promises);
  }

  async executeGraph(): Promise<OType> {
    // TODO: Validate the graph actually is linked from start to end so we don't
    //       have infinite loops
    while (this.outputNode.output === undefined) {
      await this.executeNextNodes();
    }
    return this.outputNode.output;
  }
}

// function constant<T>(data: T): (_: unknown[]) => Promise<T> {
//   return async () => data;
// }
// async function doAddition(numbers: number[]): Promise<number> {
//   return numbers.reduce((prev, cur) => prev + cur);
// }
// async function doMultiplication(numbers: number[]): Promise<number> {
//   return numbers.reduce((prev, cur) => prev * cur);
// }

// const InputA = new GraphNode(constant(5));
// const InputB = new GraphNode(constant(10));

// const AdditionNode = new GraphNode(doAddition);

// const InputC = new GraphNode(constant(3));
// const MultiplicationNode = new GraphNode(doMultiplication);

// GraphNode.linkNodes(InputA, AdditionNode);
// GraphNode.linkNodes(InputB, AdditionNode);
// GraphNode.linkNodes(AdditionNode, MultiplicationNode);
// GraphNode.linkNodes(InputC, MultiplicationNode);

// const allNodes = [InputA, InputB, InputC, AdditionNode, MultiplicationNode];
// const executor = new GraphExecutor(allNodes, MultiplicationNode);

// const output = await executor.executeGraph();
