import { describe, expect, it } from "vitest";

import { getMenuTargetScrollTop } from "../scrollMenuIntoScrollParent";

// getMenuTargetScrollTop is pure geometry — it only reads top/bottom/height off
// the rects — so plain objects stand in for DOMRect and the suite runs in node.
const rect = (top: number, height: number) =>
  ({ top, bottom: top + height, height }) as DOMRect;

const metrics = (
  scrollTop: number,
  clientHeight: number,
  maxScrollTop: number,
  containerTop = 0
) => ({
  scrollTop,
  clientHeight,
  maxScrollTop,
  containerRect: { top: containerTop } as DOMRect,
});

describe("getMenuTargetScrollTop", () => {
  it("returns null when enough of the menu is already visible", () => {
    expect(
      getMenuTargetScrollTop(metrics(0, 500, 1000), rect(100, 200))
    ).toBeNull();
  });

  it("scrolls down to reveal the minimum when the menu is clipped at the bottom", () => {
    expect(getMenuTargetScrollTop(metrics(0, 200, 1000), rect(180, 200))).toBe(
      100
    );
  });

  it("scrolls up to reveal the minimum when the menu is clipped at the top", () => {
    expect(
      getMenuTargetScrollTop(metrics(300, 200, 1000), rect(-200, 200))
    ).toBe(180);
  });

  it("reveals a short menu's full height plus padding", () => {
    // Menu height 60 < 120, so the target is 60 + 8px padding.
    expect(getMenuTargetScrollTop(metrics(0, 200, 1000), rect(190, 60))).toBe(
      58
    );
  });

  it("best-effort reveals as much as possible when the viewport is too small", () => {
    // Viewport is 100px but the target wants 120px visible: align the menu top
    // to the viewport top (scroll 50) rather than giving up.
    expect(getMenuTargetScrollTop(metrics(0, 100, 1000), rect(50, 200))).toBe(
      50
    );
  });

  it("returns null when the menu is already showing as much as the viewport allows", () => {
    // Too-small viewport, but the menu already fills it — nothing to gain.
    expect(
      getMenuTargetScrollTop(metrics(50, 100, 1000), rect(0, 200))
    ).toBeNull();
  });

  it("respects custom minVisiblePx", () => {
    // With minVisiblePx 40 the menu at the bottom edge only needs 40px revealed.
    expect(
      getMenuTargetScrollTop(metrics(0, 200, 1000), rect(180, 200), {
        minVisiblePx: 40,
      })
    ).toBe(20);
  });
});
