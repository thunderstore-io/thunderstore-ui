import { GraphEdge } from ".";

export interface IBaseGraphNode<IType, OType> {
  get backwardsEdges(): GraphEdge<unknown, unknown, unknown>[];
  get forwardsEdges(): GraphEdge<unknown, unknown, unknown>[];
  get output(): OType | undefined;
  get shouldExecute(): boolean;
  readonly action: (args: IType) => Promise<OType>;

  linkNodes(): void;
  collect(): IType;
  execute(): Promise<OType>;
}

export type Collection<T> = { [key: number]: T };
