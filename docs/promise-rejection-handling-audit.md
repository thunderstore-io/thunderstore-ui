# Promise Rejection Handling Audit

_Date:_ 2025-11-07
_Scope:_ Audit of Cyberstorm Remix UI promise handling, tracking migration to guarded async flows and remaining follow-ups.

## Requirements
- Client loaders that hand promises to Suspense must surface failures via `{ __error }` payloads (or equivalent user-facing envelope) and downstream views must branch on that union, suppressing meta tags or metadata when errors occur.

| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/commonComponents/PackageSearch/PackageSearch.tsx | Filters promise now resolved via `async/await` with cancellation guard and console logging | Low – residual risk limited to toast visibility gaps if fetch fails silently | Monitor for UX regressions; consider user-facing error toast if repeated failures observed (2025-11-15) |
| apps/cyberstorm-remix/app/upload/upload.tsx | Loader returns `LoaderResult` union; Await consumer renders inline alert when `__error` present | Low – pattern now consistent with other guarded loaders | - |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Combined filters/listings loader resolves through union helper; layout branches on `isLoaderError` with contextual alert | Low – Suspense now provides user-facing copy and prevents meta mismatches | - |
| apps/cyberstorm-remix/app/settings/teams/team/teamSettings.tsx | Loader wraps promise via `resolveLoaderPromise`; Await suppresses meta/header when union payload signals failure | Low – union guard keeps settings chrome in sync with data availability | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Profile/Profile.tsx | Profile loader surfaces `{ __error }` payload and component renders alert with helper | Low – inline alert gives actionable copy; no further follow-up needed | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Members/Members.tsx | Members loader resolves through union helper; Suspense branch renders payload-aware alert | Low – table only renders on success, preventing stale state | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx | Service accounts loader now returns union and branches Await rendering to payload-aware alert | Low – inline alert communicates failure and avoids Suspense rejection loop | - |
| apps/cyberstorm-remix/app/p/packageListing.tsx | Rated-pack fetch and hydration metadata handled via cancellable `async/await` flow with toast on failure | Low – console logging only during hydration | Add metrics hook if failures spike (2025-11-30) |
| apps/cyberstorm-remix/app/c/community.tsx | Client loader now returns community data or `{ __error }`; Suspense branch guards union and shows inline `NewAlert` while suppressing meta tags on failure | Low – meta tags stay blank when errors occur, which is acceptable but should be revisited if SEO demands alternate copy | - |
| apps/cyberstorm-remix/app/communities/communities.tsx | Loader resolves through union helper; grid await branches to payload-aware alert | Low – communicates failures inline while keeping Suspense stable | - |
| apps/cyberstorm-remix/app/p/team/Team.tsx | Loader now returns LoaderResult unions for filters/listings; view gates Suspense sections with `isLoaderError` and shows inline alert | Low – guarded alerts keep page content stable when fetches fail | - |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Loader promises wrapped with `resolveLoaderPromise`; Await components branch on `isLoaderError` and reuse alert component | Low – alert messaging keeps editor usable during API failures | - |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Listing/filters/community results now use LoaderResult unions with payload-aware alerts in the tab content | Low – inline alert replaces skeletons when data fails to load | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/ | Client loaders (Wiki.tsx, WikiFirstPage.tsx, WikiPage.tsx, WikiNewPage.tsx, WikiPageEdit.tsx) stream promises without error unions; navigation assumes data | Medium – wiki navigation and editors fail silently until boundary renders, causing inconsistent controls | Standardize on union payloads per loader and adjust nav/content components to branch on error payload (2025-12-05) |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | Loader returns LoaderResult unions for version/team; component branches meta/header/actions rendering and reuses payload alert | Low – union guard prevents Suspense rejections and keeps UX consistent | - |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | Version metadata effect handles promise rejection and avoids unmounted updates | Low – console log only | Explore user-visible fallback copy if hydrations routinely fail (2025-11-30) |

_Pending follow-ups:_ Implement the union-based client loader pattern for the medium-risk rows above (upload, community package search, team settings tabs, team/package edit, dependants, wiki module) and continue scanning sibling apps (storybook app, uploader react package) for remaining promise chains; update the table as statuses evolve.
