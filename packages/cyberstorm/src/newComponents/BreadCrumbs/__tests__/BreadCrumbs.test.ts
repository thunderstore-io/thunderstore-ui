import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { type ReactNode, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BreadCrumbs, BreadCrumbsItem } from "../BreadCrumbs";

function crumb(label: string) {
  return createElement(BreadCrumbsItem, null, label);
}

function linkCrumb(label: string, href: string) {
  return createElement(BreadCrumbsItem, { primitiveType: "link", href }, label);
}

function renderCrumbs(...children: ReactNode[]) {
  return renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(BreadCrumbs, null, ...children)
    )
  );
}

function readCrumbs(html: string) {
  return html
    .split(/<li\b/)
    .slice(1)
    .map((item) => ({
      position: item.match(/itemprop="position" content="(\d+)"/i)?.[1] ?? null,
      current: item.includes('aria-current="page"'),
      label: item.match(/itemprop="name">([^<]*)</i)?.[1] ?? null,
    }));
}

describe("BreadCrumbs", () => {
  it("flattens grouped crumbs before assigning positions", () => {
    const html = renderCrumbs(
      [crumb("Settings"), crumb("Account")],
      [[crumb("Teams"), crumb("Profile")]]
    );

    expect(readCrumbs(html)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: false, label: "Settings" },
      { position: "3", current: false, label: "Account" },
      { position: "4", current: false, label: "Teams" },
      { position: "5", current: true, label: "Profile" },
    ]);
  });

  it("numbers direct children and marks the last one current", () => {
    const html = renderCrumbs(
      crumb("Communities"),
      crumb("Catheim"),
      crumb("Package")
    );

    expect(readCrumbs(html)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: false, label: "Communities" },
      { position: "3", current: false, label: "Catheim" },
      { position: "4", current: true, label: "Package" },
    ]);
  });

  it("renders a link crumb and marks it current only when it is last", () => {
    const followed = renderCrumbs(
      linkCrumb("Communities", "/communities"),
      crumb("Package")
    );
    expect(followed).toContain('href="/communities"');
    expect(readCrumbs(followed)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: false, label: "Communities" },
      { position: "3", current: true, label: "Package" },
    ]);

    const last = renderCrumbs(linkCrumb("Tools", "/tools"));
    expect(readCrumbs(last)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: true, label: "Tools" },
    ]);
  });

  it("names text children and skips blank text", () => {
    const html = renderCrumbs(
      createElement(
        BreadCrumbsItem,
        null,
        createElement("img", { alt: "icon" }),
        "   ",
        "Named"
      )
    );

    expect(html).toContain("<img");
    expect(html.match(/itemprop="name"/gi)).toHaveLength(1);
    expect(readCrumbs(html)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: true, label: "Named" },
    ]);
  });

  it("renders only home when there are no other crumbs", () => {
    expect(readCrumbs(renderCrumbs())).toEqual([
      { position: "1", current: false, label: null },
    ]);
  });

  it("drops empty entries so the last visible crumb is current", () => {
    const html = renderCrumbs(crumb("Communities"), null, false);

    expect(readCrumbs(html)).toEqual([
      { position: "1", current: false, label: null },
      { position: "2", current: true, label: "Communities" },
    ]);
  });
});
