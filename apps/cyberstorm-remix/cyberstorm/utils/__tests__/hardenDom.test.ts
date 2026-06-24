import { afterEach, describe, expect, it } from "vitest";

import { hardenDomAgainstTranslation } from "../hardenDom";

// Minimal stand-in for the DOM Node, so the prototype guards can be exercised
// in a node environment (the real Node global only exists in the browser).
// removeChild/insertBefore mimic the DOM by throwing when the node/reference
// is not actually a child — the crash hardenDomAgainstTranslation prevents.
class FakeNode {
  parentNode: FakeNode | null = null;
  childNodes: FakeNode[] = [];

  removeChild(child: FakeNode): FakeNode {
    const i = this.childNodes.indexOf(child);
    if (i === -1) throw new Error("NotFoundError");
    this.childNodes.splice(i, 1);
    child.parentNode = null;
    return child;
  }

  insertBefore(node: FakeNode, ref: FakeNode | null): FakeNode {
    if (ref && this.childNodes.indexOf(ref) === -1) {
      throw new Error("NotFoundError");
    }
    const i = ref ? this.childNodes.indexOf(ref) : this.childNodes.length;
    this.childNodes.splice(i, 0, node);
    node.parentNode = this;
    return node;
  }
}

describe("hardenDomAgainstTranslation", () => {
  afterEach(() => {
    delete (globalThis as { Node?: unknown }).Node;
  });

  it("is a no-op when there is no DOM (SSR)", () => {
    expect(() => hardenDomAgainstTranslation()).not.toThrow();
  });

  it("guards removeChild/insertBefore against foreign-parent crashes", () => {
    (globalThis as { Node?: unknown }).Node = FakeNode;
    hardenDomAgainstTranslation();

    const parent = new FakeNode();
    const child = new FakeNode();
    parent.childNodes.push(child);
    child.parentNode = parent;

    // A real child is still removed normally.
    expect(parent.removeChild(child)).toBe(child);
    expect(parent.childNodes).toHaveLength(0);

    // A node owned by someone else: no throw, returned untouched.
    const stranger = new FakeNode();
    stranger.parentNode = new FakeNode();
    expect(() => parent.removeChild(stranger)).not.toThrow();
    expect(parent.removeChild(stranger)).toBe(stranger);

    // insertBefore with a reference node from another parent: no throw.
    const node = new FakeNode();
    const foreignRef = new FakeNode();
    foreignRef.parentNode = new FakeNode();
    expect(() => parent.insertBefore(node, foreignRef)).not.toThrow();

    // insertBefore with null reference still appends.
    const appended = new FakeNode();
    expect(parent.insertBefore(appended, null)).toBe(appended);
    expect(parent.childNodes).toContain(appended);
  });
});
