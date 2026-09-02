/**
 * Resource route serving /sitemap-packages/:file, where :file is "1.xml",
 * "2.xml" and so on, mapping directly onto a page of the sitemap API.
 *
 * The extension lives inside the param because a React Router dynamic segment
 * has to be a whole path segment: "sitemap-packages-:page.xml" matches nothing.
 */
import { parsePageParam } from "cyberstorm/utils/searchParamsUtils";
import {
  PACKAGE_SITEMAPS_ENABLED,
  PACKAGE_SITEMAP_PAGE_SIZE,
  sitemapDapper,
  sitemapResponse,
  urlTag,
} from "cyberstorm/utils/sitemap";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!PACKAGE_SITEMAPS_ENABLED) {
    throw new Response("Not found", { status: 404 });
  }

  const match = /^(\d+)\.xml$/.exec(params.file ?? "");
  const page = parsePageParam(match ? match[1] : null);
  if (page === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  // The API answers an out-of-range page with a 404, which arrives here as a
  // thrown error rather than an empty result.
  let results;
  try {
    ({ results } = await sitemapDapper().getPackageSitemapPage(
      page,
      PACKAGE_SITEMAP_PAGE_SIZE
    ));
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  if (results.length === 0) {
    throw new Response("Not found", { status: 404 });
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    results
      .map((entry) =>
        urlTag(
          request,
          `/c/${entry.community_identifier}/p/${entry.namespace}/${entry.name}/`,
          "url",
          entry.date_updated
        )
      )
      .join("\n") +
    "\n</urlset>\n";

  return sitemapResponse(body);
}
