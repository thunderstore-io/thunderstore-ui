/**
 * Resource route serving /sitemap.xml.
 *
 * Lists the always-present static routes plus every community landing page.
 * Community discovery is best-effort: if the API is unreachable we still emit a
 * valid sitemap containing the static routes rather than failing the request.
 *
 * Package-level URLs and full community pagination are intentionally not
 * enumerated here yet — a sitemap index can be layered on later if the catalog
 * grows large enough to need one.
 */
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import type { LoaderFunctionArgs } from "react-router";

import { DapperTs } from "@thunderstore/dapper-ts";

const STATIC_PATHS = [
  "/communities",
  "/tools/markdown-preview",
  "/tools/manifest-v1-validator",
];

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
    const communities = await dapper.getCommunities(
      undefined,
      undefined,
      undefined
    );
    for (const community of communities.results) {
      paths.add(`/c/${community.identifier}/`);
    }
  } catch {
    // API unreachable — emit a valid sitemap with the static routes only.
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
