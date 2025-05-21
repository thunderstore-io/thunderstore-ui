import { GraphNode } from ".";

export class GraphExecutor<IType, OType> {
  private nodes: GraphNode<unknown, unknown>[];
  private readonly outputNode: GraphNode<Extract<unknown, IType>, OType>;

  constructor(outputNode: GraphNode<Extract<unknown, IType>, OType>) {
    this.nodes = [];
    this.outputNode = outputNode;
  }

  private async crawlNodes() {
    if (this.outputNode.backwardEdges.length !== 0) {
      for (let i = 0; i < this.outputNode.backwardEdges.length; i++) {
        this.nodes.push(this.outputNode.backwardEdges[i].source);
      }
      let crawlIndex = 0;
      let moreToCrawl = true;
      while (moreToCrawl) {
        if (this.nodes[crawlIndex].backwardEdges) {
          this.nodes[crawlIndex].backwardEdges.forEach((x) => {
            if (!this.nodes.includes(x.source)) {
              this.nodes.push(x.source);
            }
          });
        }
        if (crawlIndex >= this.nodes.length - 1) {
          moreToCrawl = false;
        } else {
          crawlIndex++;
        }
      }
    }
  }

  private async executeNextNodes() {
    // Add the output node here to prevent infinite loop
    const promises = [...this.nodes, this.outputNode]
      .filter((x) => x.shouldExecute)
      .map((x) => x.execute());
    await Promise.all(promises);
  }

  async executeGraph(): Promise<OType> {
    await this.crawlNodes();
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

// // async function convertToNumber(s: string[]): Promise<number[]> {
// //   return s.map((item) => parseFloat(item));
// // }

// const InputA = new GraphNode(constant(5));
// const InputB = new GraphNode(constant(10));
// // const InputC = new GraphNode(constant(3));
// // const InputD = new GraphNode(constant("20"));
// // const InputF = new GraphNode(constant("40"));
// // const listOfMixedValueTypes: Array<
// //   [() => Promise<string>, "string"] | [() => Promise<number>, "number"]
// // > = [
// //   [async () => "69", "string"],
// //   [async () => 69, "number"],
// // ];

// // const mixedNodes = listOfMixedValueTypes.map((x) => {
// //   if (x[1] === "string") {
// //     const node = new GraphNode(x[0]);
// //     GraphNode.linkNodes(node, StringToNumberNode);
// //     return node;
// //   } else {
// //     const node = new GraphNode(x[0]);
// //     GraphNode.linkNodes(node, AdditionNode);
// //     return node;
// //   }
// // });

// const AdditionNode = new GraphNode(doAddition);
// // const StringToNumberNode = new GraphNode(convertToNumber);
// // const AdditionNode2 = new GraphNode(doAddition);

// const MultiplicationNode = new GraphNode(doMultiplication);

// GraphNode.linkNodes(InputA, AdditionNode);
// GraphNode.linkNodes(InputB, AdditionNode);
// // GraphNode.linkNodes(InputD, StringToNumberNode);
// // GraphNode.linkNodes(InputF, StringToNumberNode);
// // GraphNode.linkNodes(StringToNumberNode, AdditionNode);
// GraphNode.linkNodes(AdditionNode, MultiplicationNode);

// // function asd(node: GraphEdge<unknown>) {
// //   return node;
// // }

// // const edge = new GraphEdge<unknown>(InputA, InputB);
// // asd(edge);

// // asd(AdditionNode);

// // GraphNode.linkNodes(AdditionNode, MultiplicationNode);
// // GraphNode.linkNodes(InputC, MultiplicationNode);

// // const allNodes = [
// //   InputA,
// //   InputB,
// //   InputC,
// //   InputD,
// //   InputF,
// //   AdditionNode,
// //   // StringToNumberNode,
// //   // ...mixedNodes,
// //   MultiplicationNode,
// // ];
// const executor = new GraphExecutor(MultiplicationNode);

// // const output = await executor.executeGraph();
