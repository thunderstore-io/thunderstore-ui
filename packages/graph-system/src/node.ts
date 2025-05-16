import { GraphEdge } from ".";

export class GraphNode<IType, OType> {
  private _output: OType | undefined = undefined;
  private backardEdges: GraphEdge<IType>[] = [];
  private forwardEdges: GraphEdge<OType>[] = [];
  private readonly action: (args: IType[]) => Promise<OType>;

  constructor(action: (args: IType[]) => Promise<OType>) {
    this.action = action;
  }

  public static linkNodes<Type>(
    source: GraphNode<any, Type>,
    target: GraphNode<Type, any>
  ) {
    const edge = new GraphEdge<Type>(source, target);
    source.forwardEdges.push(edge);
    target.backardEdges.push(edge);
  }

  public static collectInputs<T>(edges: GraphEdge<T>[]): T[] | null {
    const result = edges.map((x) => x.source.output);
    if (result.every((x) => x !== undefined)) {
      return result;
    } else {
      return null;
    }
  }

  public get output(): OType | undefined {
    return this._output;
  }

  public get shouldExecute(): boolean {
    return (
      GraphNode.collectInputs(this.backardEdges) !== null &&
      this._output === undefined
    );
  }

  public async execute(): Promise<OType> {
    if (this._output) {
      return this._output;
    }
    const inputs = GraphNode.collectInputs(this.backardEdges);
    if (!inputs) {
      throw new Error("Node inputs aren't yet ready!");
    }
    this._output = await this.action(inputs);
    return this._output;
  }
}
