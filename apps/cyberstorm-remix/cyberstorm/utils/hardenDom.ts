/**
 * Guard React's DOM commit against third-party mutation.
 *
 * Page translators (Google/Edge "translate this page") and some browser
 * extensions move or replace text nodes that React still tracks. When React
 * then calls removeChild/insertBefore on a node that is no longer where it
 * expects it, the DOM throws NotFoundError and the whole React tree unmounts —
 * a full white-screen. Overriding these two Node methods to no-op when the node
 * is not actually a child of the target turns that hard crash into a
 * recoverable no-op. This is the long-standing community mitigation for the
 * React-vs-translation issue.
 *
 * Idempotent, and a no-op outside the browser (SSR has no Node global).
 */
let patched = false;

export function hardenDomAgainstTranslation(): void {
  if (patched || typeof Node === "undefined" || !Node.prototype) {
    return;
  }
  patched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function removeChild<T extends Node>(
    this: Node,
    child: T
  ): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    this: Node,
    node: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return node;
    }
    return originalInsertBefore.call(this, node, referenceNode) as T;
  };
}
