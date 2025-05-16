import { GraphNode } from ".";

export class GraphEdge<Type> {
  public readonly source: GraphNode<unknown, Type>;
  public readonly target: GraphNode<Type, unknown>;

  constructor(
    source: GraphNode<unknown, Type>,
    target: GraphNode<Type, unknown>
  ) {
    this.source = source;
    this.target = target;
  }
}
