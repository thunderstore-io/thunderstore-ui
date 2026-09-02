import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";

import { DapperTs } from "@thunderstore/dapper-ts";

// Package sitemaps need the /api/cyberstorm/sitemap/packages/ endpoint. Flip to
// true once it is deployed; until then /sitemap.xml lists only the community
// sitemap and /sitemap-packages/N.xml is a 404.
export const PACKAGE_SITEMAPS_ENABLED = false;

// The sitemap protocol caps a file at 50,000 URLs. Changing this renumbers the
// children of the index, which is harmless: crawlers re-read it.
export const PACKAGE_SITEMAP_PAGE_SIZE = 10000;

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function sitemapDapper() {
  return new DapperTs(() => ({
    apiHost: getApiHostForSsr(),
    sessionId: undefined,
  }));
}

// Built through getCanonicalUrl so an entry and the canonical of the page it
// points at can't disagree.
export function urlTag(
  request: Request,
  path: string,
  kind: "url" | "sitemap" = "url",
  lastmod?: string
): string {
  const loc = xmlEscape(getCanonicalUrl(request, path));
  const modified = lastmod
    ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>`
    : "";
  return `  <${kind}>\n    <loc>${loc}</loc>${modified}\n  </${kind}>`;
}

export function sitemapResponse(body: string, maxAge = 3600): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}`,
    },
  });
}

/**
 * How many package sitemap files the index should list. Asks for a single row
 * to read `count` rather than pulling a full page. Returns 0 when the API is
 * unreachable, so the index degrades to the community sitemap alone.
 */
export async function packageSitemapCount(): Promise<number> {
  if (!PACKAGE_SITEMAPS_ENABLED) {
    return 0;
  }
  try {
    const { count } = await sitemapDapper().getPackageSitemapPage(1, 1);
    return Math.ceil(count / PACKAGE_SITEMAP_PAGE_SIZE);
  } catch {
    return 0;
  }
}
