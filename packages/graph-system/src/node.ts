import { GraphEdge } from ".";

type ASD<I> = I extends [] ? (I extends (infer U)[] ? [U] : I) : I;

export class GraphNode<IType, OType> {
  private _output: OType | undefined = undefined;
  private _backwardEdges: GraphEdge<unknown, IType, unknown>[] = [];
  private _backwardEdge: GraphEdge<unknown, IType, unknown> | undefined =
    undefined;
  private forwardEdges: GraphEdge<unknown, OType, unknown>[] = [];
  private readonly action: (args: IType | IType[]) => Promise<OType>;
  private readonly _isSingleEdged: boolean;

  constructor(
    action: (args: IType | IType[]) => Promise<OType>,
    _isSingleEdged = false
  ) {
    this.action = action;
    this._isSingleEdged = _isSingleEdged;
  }

  public static linkNodes<SSType, Type, TTType>(
    source: GraphNode<SSType, ASD<Type>>,
    target: GraphNode<ASD<Type>, TTType>
  ) {
    const edge = new GraphEdge<SSType, ASD<Type>, TTType>(source, target);
    source.forwardEdges.push(edge);
    target._backwardEdges.push(edge);
  }

  public static collectInputs<SSType, T, TTType>(
    edges: GraphEdge<SSType, T, TTType>[]
  ): T[] | null {
    const result = edges.map((x) => x.source.output);
    if (result.every((x) => x !== undefined)) {
      return result;
    } else {
      return null;
    }
  }

  public static collectInput<SSType, T, TTType>(
    edges: GraphEdge<SSType, T, TTType>[]
  ): T[] | null {
    const result = edges.map((x) => x.source.output);
    if (result.every((x) => x !== undefined)) {
      return result;
    } else {
      return null;
    }
  }

  public get backwardEdges(): GraphEdge<unknown, unknown, unknown>[] {
    if (this._backwardEdge) {
      return [...this._backwardEdges, this._backwardEdge];
    } else {
      return this._backwardEdges;
    }
  }

  public get output(): OType | undefined {
    return this._output;
  }

  public get shouldExecute(): boolean {
    if (this._isSingleEdged) {
      if (this._backwardEdges.length > 1) {
        throw new Error("Single edged node can only have one edge");
      }
      return (
        this._backwardEdges.length === 1 &&
        this._backwardEdges[0].source.output !== undefined
      );
    }
    return (
      GraphNode.collectInputs(this._backwardEdges) !== null &&
      this._output === undefined
    );
  }

  public async execute(): Promise<OType> {
    if (this._output) {
      return this._output;
    }
    if (this._isSingleEdged) {
      if (!this._backwardEdge) {
        throw new Error("Node doesn't have a backward edge");
      }
      const input = this._backwardEdge.source.output
        ? this._backwardEdge.source.output
        : null;
      if (!input) {
        throw new Error("Node inputs aren't yet ready!");
      }
      this._output = await this.action(input);
      return this._output;
    } else {
      const inputs = GraphNode.collectInputs(this._backwardEdges);
      if (!inputs) {
        throw new Error("Node inputs aren't yet ready!");
      }
      this._output = await this.action(inputs);
      return this._output;
    }
  }
}
