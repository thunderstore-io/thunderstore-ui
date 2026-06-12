import { describe, expect, it } from "vitest";

import { cachedRoutes, extractSsrLoaderCall } from "./cachedRoutes";

// The Cache-Control emitted by cached loaders is `public` with no `Vary`, and is
// applied to both the document HTML and the cookie-bearing single-fetch `.data`
// responses, so these loaders MUST stay fully anonymous — no session/cookie
// reads, per-user data deferred to clientLoader. A session-dependent cached
// loader would let the CDN cross-serve one user's response to everyone. This
// guard catches such a regression at the source. See cyberstorm/utils/ssrLoader.ts.
//
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

describe("cached ssrLoader loaders stay anonymous", () => {
  const routes = cachedRoutes();

  it("discovers the expected cached routes", () => {
    expect(routes.length).toBeGreaterThanOrEqual(14);
  });

  for (const route of routes) {
    it(route.path, () => {
      // cachedRoutes() only includes routes whose ssrLoader call was found.
      const loaderCall = route.loaderCall as string;
      const violations = FORBIDDEN.filter(({ re }) => re.test(loaderCall)).map(
        ({ label }) => label
      );
      expect(
        violations,
        `${route.path} cached loader must not read session/cookie state ` +
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
    expect(call).not.toBeNull();
    expect(FORBIDDEN.some(({ re }) => re.test(call as string))).toBe(true);
  });

  it("allows an anonymous loader (sessionId: undefined)", () => {
    const call = extractSsrLoaderCall(
      `export const loader = ssrLoader(async () => {
         const dapper = build({ sessionId: undefined });
         return { x: 1 };
       }, { cache: true });`
    );
    expect(call).not.toBeNull();
    expect(FORBIDDEN.some(({ re }) => re.test(call as string))).toBe(false);
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
    expect(call).not.toBeNull();
    expect(FORBIDDEN.some(({ re }) => re.test(call as string))).toBe(false);
  });
});
