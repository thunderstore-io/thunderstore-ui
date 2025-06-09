import { GraphNode } from ".";
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

export class GraphExecutor<IType, OType> {
  private nodes: GraphNode<unknown, unknown>[];
  private readonly outputNode: GraphNode<Extract<unknown, IType>, OType>;
  private stopped: boolean = false;

  readonly onShouldExecuteChange = new TypedEventEmitter<boolean>();
  readonly onGraphComplete = new TypedEventEmitter<OType>();

  private resumeListener?: () => void;

  constructor(outputNode: GraphNode<Extract<unknown, IType>, OType>) {
    this.nodes = [];
    this.outputNode = outputNode;
    this.resumeListener = undefined;
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

  private executeNextNodes() {
    // Add the output node here to prevent infinite loop
    const promises = [...this.nodes, this.outputNode]
      .filter((x) => x.shouldExecute)
      .map((x) => x.execute());

    const { promise, resolve, reject } = Promise.withResolvers();

    let stopExecutionListener: (() => void) | undefined = undefined;

    const resolveAndRemoveListener = (value: unknown) => {
      if (stopExecutionListener) {
        // Remove the listener to prevent memory leaks
        stopExecutionListener();
      }
      resolve(value);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rejectAndRemoveListener = (reason: any) => {
      if (stopExecutionListener) {
        // Remove the listener to prevent memory leaks
        stopExecutionListener();
      }
      reject(reason);
    };

    stopExecutionListener = this.onShouldExecuteChange.addListener(
      async (shouldExecuteEvent) => {
        if (shouldExecuteEvent === false) {
          this.stopped = true;
          rejectAndRemoveListener(new Error("Execution stopped by user."));
        }
      }
    );

    Promise.all(promises)
      .then(resolveAndRemoveListener)
      .catch(rejectAndRemoveListener);

    return promise;
  }

  async executeGraph(): Promise<OType> {
    if (!this.resumeListener) {
      this.resumeListener = this.onShouldExecuteChange.addListener(
        async (shouldExecuteEvent) => {
          if (shouldExecuteEvent === true) {
            this.stopped = false;
            await this.executeGraph();
          }
        }
      );
    }

    await this.crawlNodes();
    while (this.outputNode.output === undefined) {
      if (this.stopped) {
        throw new Error("Execution stopped by user.");
      }
      await this.executeNextNodes();
    }

    // Remove the listener to prevent memory leaks
    this.resumeListener();
    this.onGraphComplete.emit(this.outputNode.output);
    return this.outputNode.output;
  }

  async stopExecution(): Promise<void> {
    this.onShouldExecuteChange.emit(false);
  }

  async resumeExecution(): Promise<void> {
    this.onShouldExecuteChange.emit(true);
  }
}
