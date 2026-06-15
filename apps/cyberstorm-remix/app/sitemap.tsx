/**
 * Resource route serving /sitemap.xml.
 *
 * Lists the always-present static routes plus every community landing page,
 * walking all pages of the paginated community list (capped for safety).
 * Discovery is best-effort: if the API is unreachable we still emit a valid
 * sitemap containing whatever we collected rather than failing the request.
 *
 * Package-level URLs are intentionally not enumerated here — a sitemap index
 * can be layered on later if the catalog grows large enough to need one.
 */
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import type { LoaderFunctionArgs } from "react-router";

import { DapperTs } from "@thunderstore/dapper-ts";

const STATIC_PATHS = [
  "/communities",
  "/tools/markdown-preview",
  "/tools/manifest-v1-validator",
];

// Safety cap on community pagination so one sitemap request can't fan out into
// unbounded API calls. At ~20+ communities per page this still covers a large
// catalog comfortably.
const MAX_COMMUNITY_PAGES = 50;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const paths = new Set<string>(STATIC_PATHS);

  try {
    const dapper = new DapperTs(() => ({
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    }));
    // Walk every page of the community list (getCommunities is page-paginated
    // and exposes `hasMore`). The page cap bounds the work so a huge or
    // misbehaving catalog can't turn one sitemap request into unbounded calls.
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= MAX_COMMUNITY_PAGES) {
      const { results, hasMore: moreToFetch } = await dapper.getCommunities(
        page,
        undefined,
        undefined
      );
      for (const community of results) {
        paths.add(`/c/${community.identifier}/`);
      }
      hasMore = moreToFetch;
      page += 1;
    }
  } catch {
    // API unreachable — emit a valid sitemap with whatever we collected.
  }

  const urls = Array.from(paths)
    .map(
      (path) =>
        `  <url>\n    <loc>${xmlEscape(
          getCanonicalUrl(request, path)
        )}</loc>\n  </url>`
    )
    .join("\n");

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n` +
    "</urlset>\n";

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Communities change rarely; an hour keeps crawlers fresh without load.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
