import { GraphEdge } from ".";

export class GraphNode<IType, OType> {
  private _output: OType | undefined = undefined;
  private _backwardEdges: GraphEdge<unknown, IType, unknown>[] = [];
  private forwardEdges: GraphEdge<unknown, OType, unknown>[] = [];
  private readonly action: (args: IType[]) => Promise<OType>;

  constructor(action: (args: IType[]) => Promise<OType>) {
    this.action = action;
  }

  public static linkNodes<SSType, Type, TTType>(
    source: GraphNode<SSType, Type>,
    target: GraphNode<Type, TTType>
  ) {
    const edge = new GraphEdge<SSType, Type, TTType>(source, target);
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

  public get backwardEdges(): GraphEdge<unknown, unknown, unknown>[] {
    return this._backwardEdges;
  }

  public get output(): OType | undefined {
    return this._output;
  }

  public get shouldExecute(): boolean {
    return (
      GraphNode.collectInputs(this._backwardEdges) !== null &&
      this._output === undefined
    );
  }

  public async execute(): Promise<OType> {
    if (this._output) {
      return this._output;
    }
    const inputs = GraphNode.collectInputs(this._backwardEdges);
    if (!inputs) {
      throw new Error("Node inputs aren't yet ready!");
    }
    this._output = await this.action(inputs);
    return this._output;
  }
}
