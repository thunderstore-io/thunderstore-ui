/**
 * Resource route serving /sitemap.xml, an index over /sitemap-communities.xml
 * and one /sitemap-packages/N.xml per chunk of the package catalogue.
 */
import {
  packageSitemapCount,
  sitemapResponse,
  urlTag,
} from "cyberstorm/utils/sitemap";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const pageCount = await packageSitemapCount();

  const children = [
    "/sitemap-communities.xml",
    ...Array.from(
      { length: pageCount },
      (_, i) => `/sitemap-packages/${i + 1}.xml`
    ),
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    children.map((path) => urlTag(request, path, "sitemap")).join("\n") +
    "\n</sitemapindex>\n";

  return sitemapResponse(body);
}
