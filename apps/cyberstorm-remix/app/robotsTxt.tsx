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
 */

const ROBOTS_TXT =
  [
    "User-agent: *",
    "Disallow: /auth/",
    "Allow: /api/docs/",
    "Disallow: /api/",
  ].join("\n") + "\n";

export async function loader() {
  return new Response(ROBOTS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // RFC 9309 allows crawlers to cache robots.txt for up to 24 hours;
      // a shorter explicit max-age lets rule changes roll out faster.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
