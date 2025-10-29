# Loader & Client Loader Error-Handling Audit

## Overview
- Audited every `loader` and `clientLoader` export under `apps/cyberstorm-remix`.
- Most high-traffic community and package flows now wrap Dapper calls with `handleLoaderError` plus shared status mappings (401/403/404/422) while preserving Suspense semantics on the client.
- Completed wiki child routes, team management, upload flows, and community package search tabs.
- Recommendation: continue standardising on `handleLoaderError` (with per-route copy via shared mappings) and expand reusable mappings for less common statuses (409 conflicts, 429 rate limits, etc.).

## Server loaders (`export async function loader`)
| Path | Current handling | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | ✅ Uses `handleLoaderError` with shared auth/not-found/429/server mappings | Low | Consider adding copy if community fetch introduces additional status codes. |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | ✅ Uses `handleLoaderError` with shared auth/validation/429/server mappings while preserving community filters | Low | Monitor for additional status codes if search introduces new failure modes. |
| apps/cyberstorm-remix/app/communities/communities.tsx | ✅ Uses `handleLoaderError` with auth mappings | Low; unmapped statuses fall back to default handler copy | Monitor for additional status-specific copy needs. |
| apps/cyberstorm-remix/app/healthz.tsx | Returns JSON for `/healthz`, no external calls | Low risk | None required. |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | ✅ Wrapped Dapper calls; shared mappings for 401/403/404/422 | Low; listings fallback handled | Revisit copy once dependants adds 409/500 copy requirements. |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Uses `handleLoaderError` with 404 override | ✅ Handles 404 and delegates others | Consider adding map options for 401/403 (session expired) if needed, but baseline is sound. |
| apps/cyberstorm-remix/app/p/packageListing.tsx | ✅ Loader & client use mappings, keep Suspense promises | Low; permissions promise still optional | Consider adding 409 handling for moderation workflows. |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | ✅ Wrapped with shared mappings, preserves Suspense usage | Low | Add 409 mapping if version lock exposed later. |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | ✅ Wrapped with shared mappings; client awaits for error surfacing | Low | Same as above. |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | ✅ Uses `handleLoaderError` with auth/not-found copy | Low | None. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | ✅ Loader catches and maps 401/403/404 | Low | Consider 409 copy when edit conflicts exposed. |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | ✅ Same mapping pattern applied | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | ✅ Shared mappings for auth/not-found | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | ✅ Uses shared dependency mappings (401/403/404/422) | Low | Add 429/500 copy if rate limits appear. |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | ✅ Same shared mappings applied | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | ✅ Loader wraps listing/version/dependencies in mapping-aware handler | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | ✅ Uses shared mappings; preserves Suspense | Low | Watch for 409 copy (locked source). |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | ✅ Applies exported versions mapping | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | ✅ Same mapping usage | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | ✅ Loader/client catch & map 401/403/404 | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | ✅ Wraps wiki + permissions with shared mappings | Low | Child routes now share the same mappings; monitor for new status codes as wiki grows. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | ✅ Uses `handleLoaderError` with shared wiki/409/429/server mappings; 404 returns empty wiki | Low | Monitor for additional copy requirements as wiki evolves. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | ✅ Uses `handleLoaderError` with shared wiki/409/429/server mappings while validating wiki existence | Low | Consider adding permission-based copy if future UX requires it. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | ✅ Uses `handleLoaderError` with shared wiki/409/429/server mappings; 404 returns empty result | Low | Monitor for additional copy requirements as wiki evolves. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | ✅ Uses `handleLoaderError` with shared wiki/409/429/server mappings; missing slug returns 404 payload | Low | Monitor for additional copy requirements as wiki evolves. |
| apps/cyberstorm-remix/app/p/team/Team.tsx | ✅ Uses `handleLoaderError` with shared auth/not-found/validation/429/server mappings; preserves listing filters | Low | Monitor copy needs for future status codes. |
| apps/cyberstorm-remix/app/root.tsx | Loads env only | Low risk | None. |
| apps/cyberstorm-remix/app/upload/upload.tsx | ✅ Uses `handleLoaderError` with shared auth/validation/conflict/429/server mappings when fetching communities | Low | Monitor for additional status-specific copy once upload APIs evolve. |

## Client loaders (`export async function clientLoader`)
| Path | Current handling | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | ✅ Awaited community fetch with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | ✅ Awaited filters/listings with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/communities/communities.tsx | ✅ Await + mappings before returning Suspense promise | Low | Monitor additional codes. |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | ✅ Await Promises + shared mappings | Low | — |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Uses `handleLoaderError` + 404 override | ✅ Good | Consider mapping additional codes via options if needed. |
| apps/cyberstorm-remix/app/p/packageListing.tsx | ✅ Wraps all promises; keeps Suspense semantics | Low | Consider 409 copy for moderation actions. |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | ✅ Uses shared mappings with awaited promises | Low | — |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | ✅ Same pattern | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | ✅ Await + mappings | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | ✅ Uses shared mappings | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | ✅ Awaited promises w/ mappings | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | ✅ Same | Low | — |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | ✅ Same | Low | Child routes now share the same mappings; monitor for new status codes as wiki grows. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | ✅ Awaited calls with shared mappings; keeps Suspense promises | Low | None. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | ✅ Awaited wiki check with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | ✅ Awaited wiki/page/permissions promises with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | ✅ Awaited wiki/page promises with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/p/team/Team.tsx | ✅ Awaited filters/listings promises with shared mappings | Low | None. |
| apps/cyberstorm-remix/app/root.tsx | Reads env + session; throws explicit Errors; acceptable | Low risk (explicit `Error` for missing env) | Optional: convert to `throwUserFacingPayloadResponse` with auth signage if desired. |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Members/Members.tsx | Uses `handleLoaderError` + 404 override | ✅ Good | None. |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Profile/Profile.tsx | ✅ Good | None | — |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx | ✅ Good | None | — |
| apps/cyberstorm-remix/app/settings/teams/team/teamSettings.tsx | ✅ Good | None | — |
| apps/cyberstorm-remix/app/upload/upload.tsx | ✅ Awaited communities call with shared mappings | Low | None. |

## Additional notes
- Remaining work: none.
- Expand shared mappings for less common statuses (409 conflicts, 429 rate limits, 5xx fallbacks) so future routes can reference them without bespoke copy.
- Continue preferring awaited promises inside client loaders to guarantee `handleLoaderError` can translate failures before Remix resolves Suspense.
