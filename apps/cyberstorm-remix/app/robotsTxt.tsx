/**
 * Resource route serving /robots.txt per the Robots Exclusion Protocol
 * (RFC 9309).
 *
 * The rules are a snapshot (2026-06-11) of what the legacy Django site
 * serves on thunderstore.io, where they live in an admin-editable
 * DynamicHTML placement ("robots_txt") — rule changes now require a code
 * change here. Crawlers are kept out of the API and auth endpoints, but
 * allowed into the API docs. Per RFC 9309 the longest matching path takes
 * precedence, so the "Allow: /api/docs/" exception applies regardless of
 * rule order.
 *
 * A `Sitemap:` directive pointing at /sitemap.xml is appended per request so it
 * carries the correct absolute (https) origin for the current host.
 */
import type { LoaderFunctionArgs } from "react-router";

const ROBOTS_TXT =
  [
    "User-agent: *",
    "Disallow: /auth/",
    "Allow: /api/docs/",
    "Disallow: /api/",
  ].join("\n") + "\n";

// Absolute https sitemap URL at the same origin the crawler used. We force https
// for any non-local host (the SSR proxy forwards over http) and avoid importing
// the public-env helper so this resource route stays import-light and unit
// testable in isolation.
function sitemapUrl(request: Request): string {
  const url = new URL(request.url);
  const host = url.hostname;
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
  const protocol = isLocalHost ? url.protocol : "https:";
  return `${protocol}//${url.host}/sitemap.xml`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const body = `${ROBOTS_TXT}Sitemap: ${sitemapUrl(request)}\n`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // RFC 9309 allows crawlers to cache robots.txt for up to 24 hours;
      // a shorter explicit max-age lets rule changes roll out faster.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
