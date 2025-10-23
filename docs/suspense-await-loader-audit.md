# Suspense & Await Loader Audit

## Overview
- Reviewed every `loader` and `clientLoader` under `apps/cyberstorm-remix` with a focus on Remix Suspense/Await integration.
- Goal: loaders should continue to return resolved data for SSR when possible, while client loaders should hand back the original promises so UI-level `Suspense` components can present fallbacks during client transitions.
- Server loaders continue to provide SSR-friendly resolved data so markup remains deterministic during the initial render.
- Refactored client loaders now return their original promises, letting Suspense fallbacks surface loading states and consolidate error handling in the UI.

## Server loaders (`export async function loader`)
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | Returns resolved community object for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Returns resolved filters and listings for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/communities/communities.tsx | Returns resolved community listings for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Returns resolved community, listing, and filter data for predictable SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Returns fully awaited package edit payload for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/packageListing.tsx | Returns awaited listing, versions, and permissions for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | Returns resolved community, version, and team data for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | Returns resolved package version data for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | Returns resolved markdown payload for deterministic SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | Returns resolved readme payload for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | Returns resolved readme payload for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | Returns resolved readme payload for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | Returns resolved version and dependency data for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | Returns resolved version and dependency data for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | Returns resolved version and dependency data for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | Returns resolved source payload for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | Returns resolved version list for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | Returns resolved version list for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | Returns resolved version list for SSR (updated Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | Returns resolved wiki object plus primitive IDs for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | Returns resolved wiki and page objects for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | Returns resolved metadata for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | Returns resolved wiki and page data for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | Returns resolved page structure for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/p/team/Team.tsx | Returns resolved filters and listings for SSR (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/root.tsx | Returns env and session data synchronously (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/upload/upload.tsx | Returns resolved community list for SSR (confirmed Oct 30 2025). | Low | - |

## Client loaders (`export async function clientLoader`)
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | Streams community promise to Suspense with alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Streams filters and listings promises to Suspense with alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/communities/communities.tsx | Streams community list promise via layout Suspense with alert boundary (updated Oct 29 2025). | High | - |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Streams dependant data promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/packageEdit.tsx | Defers listing, filter, and team promises to Suspense with alert error surface (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/packageListing.tsx | Streams listing, versions, and permissions promises with shared alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/packageVersion.tsx | Streams community, version, and team promises through Suspense with alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/packageVersionWithoutCommunity.tsx | Streams package version promise set with shared boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx | Streams changelog promise with markdown skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionReadme.tsx | Streams readme promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx | Streams readme promise with shared Suspense boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx | Streams readme promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionRequired.tsx | Streams dependency promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Required/PackageVersionWithoutCommunityRequired.tsx | Streams dependency promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Required/Required.tsx | Streams dependency promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Source/Source.tsx | Streams source payload promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionVersions.tsx | Streams versions promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx | Streams versions promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Versions/Versions.tsx | Streams versions promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/Wiki.tsx | Streams wiki and permission promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiFirstPage.tsx | Streams wiki, page, and permission promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx | Streams wiki metadata promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | Medium | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPage.tsx | Streams wiki, page, and permission promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx | Streams wiki and page promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/p/team/Team.tsx | Streams filters and listings promises with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/root.tsx | Returns env and session data synchronously; no Suspense usage (confirmed Oct 30 2025). | Low | - |
| apps/cyberstorm-remix/app/upload/upload.tsx | Streams community list promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/settings/teams/team/teamSettings.tsx | Streams team promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Profile/Profile.tsx | Streams team promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/Members/Members.tsx | Streams member promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |
| apps/cyberstorm-remix/app/settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx | Streams service account promise with Suspense skeleton and alert boundary (updated Oct 30 2025). | High | - |

## Additional notes
- All audited client loaders now return raw promises and delegate loading and error UI to Suspense `Await` wrappers (confirmed Oct 30 2025).
- Server loaders remain fully awaited so SSR output stays predictable while clients stream data.
- Shared error helpers (`handleLoaderError`, `resolveRouteErrorPayload`, `throwUserFacingPayloadResponse`) back the alert boundaries across the audited routes.
- Team settings layout and nested tabs share the Suspense skeleton and alert pattern introduced during this pass (updated Oct 30 2025).
- Future audits should document any routes that need both resolved SSR data and streamed client promises to keep contracts clear for downstream components.
