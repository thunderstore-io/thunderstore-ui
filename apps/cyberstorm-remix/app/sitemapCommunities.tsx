/**
 * Resource route serving /sitemap-communities.xml: the static routes plus every
 * community landing page.
 */
import {
  sitemapDapper,
  sitemapResponse,
  urlTag,
} from "cyberstorm/utils/sitemap";
import type { LoaderFunctionArgs } from "react-router";

const STATIC_PATHS = [
  "/communities",
  "/tools/markdown-preview",
  "/tools/manifest-v1-validator",
];

// Bounds the fan-out so one sitemap request can't make unbounded API calls.
const MAX_COMMUNITY_PAGES = 50;

export async function loader({ request }: LoaderFunctionArgs) {
  const paths = new Set<string>(STATIC_PATHS);

  try {
    const dapper = sitemapDapper();
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
    // Emit a valid sitemap with whatever we collected.
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    Array.from(paths)
      .map((path) => urlTag(request, path))
      .join("\n") +
    "\n</urlset>\n";

  return sitemapResponse(body);
}
