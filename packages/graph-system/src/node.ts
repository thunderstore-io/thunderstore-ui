import { GraphEdge } from ".";
import { MultiGraphEdge } from "./edge";

type Collection<T> = { [key: number]: T };

export class GraphNode<IType, OType> {
  private _output: OType | undefined = undefined;
  private _backwardEdges: (
    | GraphEdge<unknown, IType, unknown>
    | MultiGraphEdge<unknown, IType, unknown>
  )[] = [];
  private forwardEdges: (
    | GraphEdge<unknown, OType, unknown>
    | MultiGraphEdge<unknown, OType, unknown>
  )[] = [];
  private readonly action: (args: IType) => Promise<OType>;

  constructor(
    // This needs to figure out which it's getting
    action: (args: IType) => Promise<OType>
  ) {
    this.action = action;
  }

  public static soloLink<SSType, Type, TTType>(
    source: GraphNode<SSType, Type>,
    target: GraphNode<Type, TTType>
  ) {
    const edge = new GraphEdge<SSType, Type, TTType>(source, target);
    source.forwardEdges.push(edge);
    target._backwardEdges.push(edge);
  }

  public static multiLink<SSType, Type, TTType>(
    source: GraphNode<SSType, Type>,
    target: GraphNode<Type[], TTType>
  ) {
    const edge = new MultiGraphEdge<SSType, Type, TTType>(source, target);
    source.forwardEdges.push(edge);
    target._backwardEdges.push(edge);
  }

  public static collect<SSType, T, TTType>(
    edges: (GraphEdge<SSType, T, TTType> | MultiGraphEdge<SSType, T, TTType>)[]
  ): Collection<T> | null {
    const result: Collection<T> = {};
    const outputs = edges.map((x, index) => {
      if (x.source.output) {
        result[index] = x.source.output;
      }
      return x.source.output;
    });
    if (outputs.every((x) => x !== undefined)) {
      return result;
    } else {
      return null;
    }
  }

  public get backwardEdges(): (
    | GraphEdge<unknown, unknown, unknown>
    | MultiGraphEdge<unknown, unknown, unknown>
  )[] {
    return this._backwardEdges;
  }

  public get output(): OType | undefined {
    return this._output;
  }

  public get shouldExecute(): boolean {
    return (
      GraphNode.collect(this._backwardEdges) !== null &&
      this._output === undefined
    );
  }

  public async execute(): Promise<OType> {
    if (this._output) {
      return this._output;
    }
    let i = null;
    i = GraphNode.collect(this._backwardEdges);
    if (!i) {
      throw new Error("Node inputs aren't yet ready!");
    }

    let input: IType | null = null;

    // The secret sauce is here; we'll just assume that if the object has a single key, it's a single input.
    // Though checking if it's a sololink or a multilink should not be done, since there can also just be one multilink.
    if (Object.keys(i).length === 1) {
      input = i["0"];
    } else {
      const inputItems = [];
      for (const key in i) {
        inputItems.push(i[key]);
      }
      input = inputItems as IType;
    }

    this._output = await this.action(input);
    return this._output;
  }
}
