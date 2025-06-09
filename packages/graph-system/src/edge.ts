import { GraphNode } from ".";

export class GraphEdge<SSType, Type, TTType> {
  public readonly source: GraphNode<Extract<SSType, unknown>, Type>;
  public readonly target: GraphNode<Type, TTType>;

  constructor(
    source: GraphNode<Extract<SSType, unknown>, Type>,
    target: GraphNode<Type, TTType>
  ) {
    this.source = source;
    this.target = target;
  }
}

export class MultiGraphEdge<SSType, Type, TTType> {
  public readonly source: GraphNode<Extract<SSType, unknown>, Type>;
  public readonly target: GraphNode<Type[], TTType>;

  constructor(
    source: GraphNode<Extract<SSType, unknown>, Type>,
    target: GraphNode<Type[], TTType>
  ) {
    this.source = source;
    this.target = target;
  }
}
