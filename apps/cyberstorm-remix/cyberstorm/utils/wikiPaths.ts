// A path segment as the router sees it. React Router decodes route params, so
// a comparison against them has to decode too, or `/wiki/%6Eew` and
// `/wiki/1459-%61-page/edit` slip past as something other than editors. A
// malformed escape cannot be what the router decoded, so it is left alone and
// simply fails to match.
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

// The router matches a static segment without regard to case, so `/wiki/NEW`
// reaches the create form as readily as `/wiki/new` does. A slug is compared
// exactly instead: the router hands it over with the case the URL used, so the
// two already agree.
function isStaticSegment(value: string, segment: string): boolean {
  return value.toLowerCase() === segment;
}

/**
 * Whether a wiki URL is one of the editors — the "create a page" form or the
 * "edit this page" form — rather than a page someone reads.
 *
 * `new` and `edit` are static segments the router matches ahead of a slug, and
 * matches without regard to case, so
 * the editor is exactly a path whose last two segments are `wiki` and `new`,
 * or the slug and `edit`. Both are compared against the slug the router
 * resolved rather than searched for by name: a slug is free-form text, so
 * looking for the last `wiki` segment mistakes a page slugged `wiki` for the
 * route segment, and looking for a trailing `edit` mistakes a page slugged
 * `edit` for an editor.
 */
export function isWikiEditorPath(
  pathname: string,
  slug: string | undefined
): boolean {
  const segments = pathname.split("/").filter(Boolean).map(decodeSegment);
  if (segments.length < 2) {
    return false;
  }
  const last = segments[segments.length - 1];
  const previous = segments[segments.length - 2];
  return slug === undefined
    ? isStaticSegment(last, "new") && isStaticSegment(previous, "wiki")
    : isStaticSegment(last, "edit") && previous === slug;
}
