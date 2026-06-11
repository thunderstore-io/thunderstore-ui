import { redirect } from "react-router";

import type { Route } from "./+types/legacyPackageRedirect";

/**
 * Redirects the legacy base-domain `/package/...` URLs to their
 * community-scoped `/c/<community>/...` equivalents in the new app.
 *
 * On the old Django site the base domain (thunderstore.io) was served by the
 * Risk of Rain 2 `CommunitySite`: every `/package/...` path resolved against
 * the `riskofrain2` community (the backend's `get_default_community()`), so a
 * shared link like https://thunderstore.io/package/x753/AudioEngineFix/ meant
 * the riskofrain2 listing of that package. The new app namespaces every
 * community under `/c/<id>/`, so those bare `/package/...` links (search
 * engines, READMEs, Discord, …) would now 404. This resource route catches
 * them via the `/package/*` splat and 301s to the matching community URL.
 *
 * The legacy URL shapes mirrored here are `legacy_package_urls` in the backend
 * (thunderstore/repository/urls.py), mounted under `/package/`.
 */

// The community the legacy base domain mapped to. Mirrors the backend's
// get_default_community() (thunderstore/community/utils.py), hardcoded to
// "riskofrain2".
const LEGACY_BASE_COMMUNITY = "riskofrain2";

// External package-format docs, matching the legacy `/package/create/docs/`
// redirect and the LinkLibrary `PackageFormatDocs` target.
const PACKAGE_FORMAT_DOCS_URL =
  "https://wiki.thunderstore.io/mods/creating-a-package";

// Third path segment keywords that select a package tab. The legacy URLconf
// registered these before the catch-all `<owner>/<name>/<version>/` route, so
// any other third segment is treated as a version number below.
const PACKAGE_TABS = new Set(["versions", "changelog", "source", "dependants"]);

export function loader({ params, request }: Route.LoaderArgs) {
  const segments = (params["*"] ?? "").split("/").filter(Boolean);
  const target = resolveTarget(segments);

  // Carry the query string over to in-app targets; the external docs URL is
  // returned verbatim.
  const search = target.startsWith("http") ? "" : new URL(request.url).search;

  return redirect(`${target}${search}`, 301);
}

function resolveTarget(segments: string[]): string {
  const base = `/c/${LEGACY_BASE_COMMUNITY}`;

  // /package/ -> the community's package listing
  if (segments.length === 0) {
    return `${base}/`;
  }

  const [first, second, third] = segments;

  // /package/create -> the upload page; /package/create/docs[/...] -> the
  // external format docs. Any other /package/create/<name>/... path belongs to
  // a team literally named "create" and falls through to the owner handling
  // below (the backend's catch-all `<owner>/<name>/` route resolved it the same
  // way, since "create" is a valid, unreserved namespace).
  if (first === "create") {
    if (segments.length === 1) {
      return "/package/create";
    }
    if (second === "docs") {
      return PACKAGE_FORMAT_DOCS_URL;
    }
  }

  // /package/download/<owner>/<name>/<version>/ is a binary download served by
  // the backend, never a community page -> leave it a 404. Other
  // /package/download/... shapes belong to a team named "download" and fall
  // through to the owner handling below.
  if (first === "download" && segments.length === 4) {
    throw new Response("Not Found", { status: 404 });
  }

  const owner = first;

  // /package/<owner>/ -> the team's package listing
  if (segments.length === 1) {
    return `${base}/p/${owner}/`;
  }

  const name = second;
  const packageBase = `${base}/p/${owner}/${name}`;

  // /package/<owner>/<name>/ -> package detail (readme)
  if (segments.length === 2) {
    return `${packageBase}/`;
  }

  // /package/<owner>/<name>/wiki[/...] -> the package wiki. The legacy wiki page
  // segment is `<id>-<slug>`, which is exactly the `full_slug` the new wiki
  // addresses pages by, so the remainder passes straight through (covers the
  // wiki home, /new, /<slug>, and /<slug>/edit).
  if (third === "wiki") {
    const rest = segments.slice(3).join("/");
    return rest ? `${packageBase}/wiki/${rest}` : `${packageBase}/wiki`;
  }

  // /package/<owner>/<name>/<tab>/ -> the matching package tab
  if (segments.length === 3 && PACKAGE_TABS.has(third)) {
    // `dependants` keeps the trailing slash used by its canonical link form.
    return third === "dependants"
      ? `${packageBase}/dependants/`
      : `${packageBase}/${third}`;
  }

  // /package/<owner>/<name>/<version>/ -> version detail
  if (segments.length === 3) {
    return `${packageBase}/v/${third}/`;
  }

  // Unknown deeper path -> fall back to the package detail page.
  return `${packageBase}/`;
}
