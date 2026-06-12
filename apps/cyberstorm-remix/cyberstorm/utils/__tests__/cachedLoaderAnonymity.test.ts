import { describe, expect, it } from "vitest";

// Read route source as raw strings via Vite (Node's fs is unavailable in the
// browser test environment). Keyed by path relative to this file.
const routeSources = import.meta.glob("../../../app/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function sourceOf(appRelativePath: string): string {
  const key = `../../../${appRelativePath}`;
  const content = routeSources[key];
  if (content === undefined) {
    throw new Error(`Route source not found for ${appRelativePath}`);
  }
  return content;
}

// Routes whose loader is wrapped with `ssrLoader(..., { cache: ... })`. The
// emitted Cache-Control is `public` with no `Vary`, applied to both the
// document HTML and the single-fetch `.data` responses, so these loaders MUST
// stay fully anonymous — no session/cookie reads, per-user data deferred to
// clientLoader. A session-dependent cached loader would let the CDN cross-serve
// one user's response to everyone. This guard catches such a regression at the
// source. See cyberstorm/utils/ssrLoader.ts.
const cachedRouteFiles = [
  "app/communities/communities.tsx",
  "app/p/packageListing.tsx",
  "app/p/packageListingVersion.tsx",
  "app/p/dependants/Dependants.tsx",
  "app/p/tabs/Wiki/WikiFirstPage.tsx",
  "app/p/tabs/Wiki/WikiPage.tsx",
  "app/p/tabs/Wiki/Wiki.tsx",
  "app/p/tabs/Readme/PackageVersionReadme.tsx",
  "app/p/tabs/Readme/Readme.tsx",
  "app/p/tabs/Changelog/Changelog.tsx",
  "app/p/tabs/Required/Required.tsx",
  "app/p/tabs/Versions/Versions.tsx",
  "app/p/tabs/Versions/PackageVersionVersions.tsx",
  "app/c/Community.tsx",
];

// Patterns that indicate a loader reads the session/cookie. `sessionId: undefined`
// is the explicit anonymous marker and is allowed; anything else assigned to
// sessionId is not.
const FORBIDDEN = [
  { re: /getSession\w*/, label: "getSession* (session/cookie read)" },
  {
    re: /\.headers\.get\(\s*["']cookie["']/i,
    label: 'request.headers.get("cookie")',
  },
  {
    re: /sessionId:\s*(?!undefined\b)[A-Za-z_$]/,
    label: "non-anonymous sessionId assignment",
  },
];

/**
 * Extracts the full `ssrLoader( ... )` call expression (server loader + options)
 * by matching balanced parentheses, so the scan ignores the route's clientLoader
 * and imports, which legitimately read the session.
 */
function extractSsrLoaderCall(source: string): string {
  const marker = "ssrLoader(";
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error("no ssrLoader( call found");
  }
  let depth = 0;
  for (let i = start + marker.length - 1; i < source.length; i++) {
    const ch = source[i];
    if (ch === "(") depth++;
    else if (ch === ")" && --depth === 0) {
      return source.slice(start, i + 1);
    }
  }
  throw new Error("unbalanced ssrLoader( call");
}

describe("cached ssrLoader loaders stay anonymous", () => {
  for (const file of cachedRouteFiles) {
    it(file, () => {
      const loaderCall = extractSsrLoaderCall(sourceOf(file));
      const violations = FORBIDDEN.filter(({ re }) => re.test(loaderCall)).map(
        ({ label }) => label
      );
      expect(
        violations,
        `${file} cached loader must not read session/cookie state ` +
          `(found: ${violations.join(
            ", "
          )}). Defer per-user data to clientLoader.`
      ).toEqual([]);
    });
  }
});

describe("extractSsrLoaderCall / FORBIDDEN sanity", () => {
  it("flags a session read inside the loader", () => {
    const call = extractSsrLoaderCall(
      `export const loader = ssrLoader(async () => {
         const tools = getSessionTools();
         return { x: tools };
       }, { cache: true });`
    );
    expect(FORBIDDEN.some(({ re }) => re.test(call))).toBe(true);
  });

  it("allows an anonymous loader (sessionId: undefined)", () => {
    const call = extractSsrLoaderCall(
      `export const loader = ssrLoader(async () => {
         const dapper = build({ sessionId: undefined });
         return { x: 1 };
       }, { cache: true });`
    );
    expect(FORBIDDEN.some(({ re }) => re.test(call))).toBe(false);
  });

  it("does not scan the clientLoader (session reads there are fine)", () => {
    const source = `export const loader = ssrLoader(async () => {
        return { sessionId: undefined };
      }, { cache: true });

      export async function clientLoader() {
        const tools = getSessionTools();
        return { sessionId: tools.getConfig().sessionId };
      }`;
    const call = extractSsrLoaderCall(source);
    expect(FORBIDDEN.some(({ re }) => re.test(call))).toBe(false);
  });
});
