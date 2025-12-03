import { describe, expect, it } from "vitest";

import { GraphEdge, GraphNode } from "..";

describe("GraphEdge", () => {
  it("should create an edge with source and target nodes", () => {
    const sourceNode = new GraphNode<unknown, number>(async () => 5);
    const targetNode = new GraphNode<number, unknown>(async () => undefined);

    const edge = new GraphEdge<unknown, number, unknown>(
      sourceNode,
      targetNode
    );

    expect(edge.source).toBe(sourceNode);
    expect(edge.target).toBe(targetNode);
  });
});
