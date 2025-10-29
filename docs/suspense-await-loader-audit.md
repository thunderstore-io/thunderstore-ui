# Suspense & Await Loader Audit

## Overview
- Reviewed every `loader` and `clientLoader` under `apps/cyberstorm-remix` with a focus on Remix Suspense/Await integration.
- Goal: loaders should continue to return resolved data for SSR when possible, while client loaders should hand back the original promises so UI-level `Suspense` components can present fallbacks during client transitions.
- Presently, most loaders still provide SSR-friendly resolved data, but nearly every client loader resolves its data before returning. This prevents Suspense fallbacks from appearing and forces duplicate error handling inside the loader.
- A handful of server loaders also bubble promises (after awaiting for error handling) instead of returning concrete values, making SSR less predictable.

## Server loaders (`export async function loader`)
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | Returns resolved community object (SSR-friendly). | Low | No change needed once client side is updated. |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Resolves filters/listings before return. | Low | No action required; just ensure layout Suspense owns client errors. |
| apps/cyberstorm-remix/app/communities/communities.tsx | Returns resolved listings; SSR works today. | Low | Keep as-is after client loader shift. |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Resolves filters but returns other promises that were awaited only for errors. | Medium | Convert return shape to plain data (or explicit `{value, promise}` split) so SSR has concrete values. |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Returns fully awaited data. | Low | No change required. |
| apps/cyberstorm-remix/app/p/packageListing.tsx | Returns awaited data across all fields. | Low | Nothing to do. |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | Returns promises after `Promise.all`, leaving layout to unwrap. | Medium | Return concrete objects for SSR; move promise handing to client loader/layout combo. |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | Returns resolved data. | Low | No change needed. |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | Returns resolved promise object (already awaited). | Medium | Return the markdown payload rather than the promise. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | Same: returns promise after awaiting. | Medium | Return resolved readme HTML for SSR, shift promise handling to client loader. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | Returns promise after awaiting. | Medium | Same recommendation as above. |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | Returns promise after awaiting. | Medium | Return resolved value, keep Suspense only on client path. |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | Returns promises post-`Promise.all`. | Medium | Replace with resolved arrays/objects for SSR clarity. |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | Returns promises after awaiting. | Medium | Same fix as other dependency tabs. |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | Mix of resolved data and promises. | Medium | Normalize to resolved data. |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | Returns promise after awaiting the fetch. | Medium | Provide final source payload to SSR, leave streaming to client. |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | Returns promise after awaiting. | Medium | Return resolved version list, keep Suspense usage for client transitions only. |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | Returns promise after awaiting. | Medium | Same update as above. |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | Returns promise after awaiting. | Medium | Return resolved versions. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | Returns resolved wiki object + primitive IDs. | Low | Already SSR friendly; no change. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | Returns resolved wiki/page objects (plus IDs). | Low | Fine as-is. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | Returns resolved metadata (no wiki promise). | Low | No change required. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | Returns resolved wiki/page. | Low | No change required. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | Returns resolved page struct. | Low | Good for SSR. |
| apps/cyberstorm-remix/app/p/team/Team.tsx | Returns resolved filters/listings. | Low | Already SSR friendly. |
| apps/cyberstorm-remix/app/root.tsx | Returns env/session data synchronously. | Low | No change needed. |
| apps/cyberstorm-remix/app/upload/upload.tsx | Returns resolved community list. | Low | No change needed. |

## Client loaders (`export async function clientLoader`)
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | Awaits community before returning, so Suspense gets an already-resolved value. | High | Stop awaiting; return the raw promise and let layout handle errors via Suspense/ErrorBoundary. |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Uses `await Promise.all` then returns resolved values. | High | Return the original promises (or re-wrap) and surface errors in layout. |
| apps/cyberstorm-remix/app/communities/communities.tsx | Awaits `getCommunities` before returning. | High | ✅ Completed Oct 29 2025 — client loader returns the original promise and the route-level ErrorBoundary surfaces `resolveRouteErrorPayload`. |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Awaits all data; returns a mix of resolved values/promises. | High | Return promises for listings/community and relocate error handling + boundaries. |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Fully awaits everything prior to return. | High | Return deferred promises (especially listing/filters) and surface permission errors via boundary. |
| apps/cyberstorm-remix/app/p/packageListing.tsx | Awaits all resources (Promise.all) before returning. | High | Return the original promises to preserve Suspense UX. |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | Awaits each fetch, handing back resolved objects. | High | Return raw promises; relocate error management to layout-level boundaries. |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | Awaits via `Promise.all`, then returns resolved promises. | High | Return unresolved promises so Suspense fallback renders. |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | Awaits changelog promise before returning. | High | Return `changelogPromise`; move error handling to component boundary. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | Awaits readme before returning. | High | Return promise and catch errors in layout. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | Same as above. | High | Same fix. |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | Awaits readme before returning. | High | Return promise and handle errors higher up. |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | Awaits via `Promise.all`, returning resolved promises. | High | Stop awaiting; let Suspense manage loading states. |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | Same pattern. | High | Same update. |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | Awaits dependencies before return. | High | Return raw promises & elevate error handling. |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | Awaits source payload before returning. | High | Return promise and add boundary in layout. |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | Awaits versions before returning. | High | Return promise; move error handling to Suspense boundary. |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | Same. | High | Same fix. |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | Same. | High | Same fix. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | Awaits both wiki & permissions before returning promises. | High | Return promises without awaiting; relocate error handling to wiki layout component. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | Awaits wiki/page/permissions before returning (mix of resolved/promise). | High | Return raw promises; add route-level Suspense/ErrorBoundary. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | Awaits wiki existence before returning. | Medium | Consider returning promise if metadata fetch should show skeleton; ensure layout can render boundary copy. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | Awaits wiki/page before returning promises. | High | Return promises untouched; surface errors via layout boundary. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | Awaits wiki/page before returning. | High | Return promises, introduce Suspense boundary for editor. |
| apps/cyberstorm-remix/app/p/team/Team.tsx | Awaits filters/listings prior to return. | High | Return promises so team tab skeleton renders; move error handling to route-level boundary. |
| apps/cyberstorm-remix/app/root.tsx | Returns env/session synchronously. | Low | No Suspense usage; unchanged. |
| apps/cyberstorm-remix/app/upload/upload.tsx | Awaits community list before returning. | High | Return promise to allow upload page skeleton; move errors to boundary. |

## Additional notes
- Nearly all client loaders still resolve data and map errors before returning, which defeats Suspense fallbacks. Refactor client loaders to return raw promises and relocate error handling to the components that call `Await`.
- Communities route now confirmed working with promise-based client loader and shared ErrorBoundary pattern (Oct 29 2025).
- Several loaders (notably changelog/readme/versions/dependant flows) return promise objects after awaiting; switch those to resolved values to maximize SSR benefit.
- Introducing route-level `ErrorBoundary` components for Suspense-driven layouts will allow graceful rendering when client promises reject.
- When refactoring, prefer a consistent shape (e.g., `{ value, promise }`) if both SSR data and client streaming are required, and document the contract for downstream components.
