import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { AdContainer, type StaticAd } from "@thunderstore/cyberstorm";

import { SLOT_MEDIA, creative, when } from "../adCampaign";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

const WIDE = creative("fixture-wide", 980, 250);
const NARROW = creative("fixture-narrow", 300, 250);

const TWO_SHAPES: StaticAd = {
  href: "https://example.invalid/offer",
  alt: "An advert",
  campaignId: "fixture-bottom",
  creatives: [when(SLOT_MEDIA.bottomRowFits980, WIDE), NARROW],
};
const ONE_SHAPE: StaticAd = {
  href: "https://example.invalid/offer",
  alt: "An advert",
  campaignId: "fixture-sidebar",
  creatives: [NARROW],
};

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
});

async function render(props: Parameters<typeof AdContainer>[0]) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(AdContainer, props));
  });
  const slot = container.querySelector<HTMLElement>(".ad-container");
  if (!slot) {
    throw new Error("no .ad-container rendered");
  }
  return slot;
}

const markup = (props: Parameters<typeof AdContainer>[0]) =>
  renderToStaticMarkup(createElement(AdContainer, props));

describe("newComponents.AdContainer static creatives", () => {
  it("keeps the house fallback on a network-served slot", async () => {
    const slot = await render({
      containerId: "test-bottom",
      sizeVariant: "bottom-banner",
    });
    expect(slot.querySelector(".ad-container__fallback")).not.toBeNull();
    expect(slot.querySelector(".ad-container__static")).toBeNull();
  });

  it("drops the house fallback on a directly-sold slot", async () => {
    const slot = await render({
      containerId: "test-bottom-static",
      sizeVariant: "bottom-banner",
      staticAd: TWO_SHAPES,
    });
    expect(slot.querySelector(".ad-container__fallback")).toBeNull();
    expect(slot.querySelector(".ad-container__static")).not.toBeNull();
  });

  it("links the creative out as a sponsored ad in a new tab", async () => {
    const slot = await render({
      containerId: "test-sidebar",
      sizeVariant: "display-300-250",
      staticAd: ONE_SHAPE,
    });
    const link = slot.querySelector<HTMLAnchorElement>(".ad-container__static");
    expect(link?.getAttribute("href")).toBe(ONE_SHAPE.href);
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("sponsored");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link?.dataset.adCampaign).toBe(ONE_SHAPE.campaignId);
  });

  it("renders nothing for a size tier with no artwork", async () => {
    const slot = await render({
      containerId: "test-empty",
      sizeVariant: "rail-300x100",
      staticAd: { ...ONE_SHAPE, creatives: [] },
    });
    expect(slot.querySelector(".ad-container__static")).toBeNull();
  });
});

describe("newComponents.AdContainer server rendering", () => {
  it("server-renders every supplied creative", () => {
    const html = markup({
      containerId: "ssr",
      sizeVariant: "bottom-banner",
      staticAd: TWO_SHAPES,
    });
    expect(html).toContain(TWO_SHAPES.href);
    for (const c of TWO_SHAPES.creatives) {
      expect(html).toContain(c.src);
    }
  });

  it("offers each alternative shape under its own media condition", () => {
    const [wide, narrow] = TWO_SHAPES.creatives;
    expect(wide.media).toBeTruthy();
    expect(narrow.media).toBeUndefined();

    const html = markup({
      containerId: "ssr-bottom",
      sizeVariant: "bottom-banner",
      staticAd: TWO_SHAPES,
    });
    expect(html).toContain(`media="${wide.media}"`);
    expect(html).toContain(`<img src="${narrow.src}"`);
  });

  it("lazy-loads the creative", () => {
    expect(
      markup({
        containerId: "ssr-lazy",
        sizeVariant: "bottom-banner",
        staticAd: TWO_SHAPES,
      })
    ).toContain('loading="lazy"');
  });

  it("declares each creative's intrinsic size", () => {
    const html = markup({
      containerId: "ssr-size",
      sizeVariant: "bottom-banner",
      staticAd: TWO_SHAPES,
    });
    for (const c of TWO_SHAPES.creatives) {
      expect(html).toContain(`width="${c.width}"`);
      expect(html).toContain(`height="${c.height}"`);
    }
  });
});
