# Nimbus Error Boundary Route Audit

**Date:** 2025-11-06
**Branch:** 10-23-improve_api_error_handling_and_surface_user-facing_errors
**Scope:** Ensure every major Remix route renders within `NimbusErrorBoundary` to provide consistent client-side crash handling.

## Summary
- Root layout, communities, package listing, package tabs, wiki routes, and settings tabs now wrap render trees with `NimbusErrorBoundary`.
- Remaining gaps concentrated in upload flow and any legacy routes not listed below; continue iterating until all audit entries read "Low risk".
- Many nested routes export Remix `ErrorBoundary` functions for loader/action failures; Nimbus now provides runtime protection as well.

## Usage Rule
- Every Remix route component (`default` export) must render its visible UI inside `NimbusErrorBoundary`. Document deviations inline with rationale and planned follow-up.

## Risk Assessment
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| `app/root.tsx` | ✅ Layout shell and `<Outlet />` render inside `NimbusErrorBoundary` with `AppShellErrorFallback` and retry support. | Low – runtime crashes surface friendly copy with retry. | - |
| `app/communities/communities.tsx` | ✅ Entire route renders within `NimbusErrorBoundary` while retaining Remix `ErrorBoundary` for loader failures (updated 2025-11-06). | Low – runtime errors surface boundary fallback instead of blank screen. | - |
| `app/c/community.tsx` | ✅ Route-level `NimbusErrorBoundary` now wraps header, tabs, and outlet with community-specific fallback copy (updated 2025-11-06). | Low – synchronous errors render boundary UI with retry affordance. | - |
| `app/p/packageListing.tsx` and nested tabs (`app/p/tabs/**`) | ✅ Route body and tabs (Changelog, Readme, Requirements, Source, Versions, Wiki) wrap in `NimbusErrorBoundary` with tailored fallback copy (updated 2025-11-06). | Low – tab-level crashes isolate to local fallback with retry. | - |
| `app/p/packageVersion*.tsx` | Route bodies wrap with `NimbusErrorBoundary`; Remix `ErrorBoundary` retained for loader issues. | Low – ensure nested tab routes keep consistent coverage. | - |
| `app/settings/**` | ✅ User, account, connections, and teams tabs render inside Nimbus with tab-specific fallbacks (updated 2025-11-06). | Low – settings crashes recover with retry. Document remaining tabs as they are audited. | - |
| `app/settings/teams/Teams.tsx` | ✅ Teams tab wraps UI in `NimbusErrorBoundary` with reusable fallback copy (updated 2025-11-06). | Low – localised crash messaging guides retry. | - |
| `app/upload/upload.tsx` | Complex Suspense/polling stack without boundary. | High – runtime failures break upload flow. | Wrap route output in `NimbusErrorBoundary` with upload-specific messaging. |
| `app/commonComponents/NimbusErrorBoundary/*` | Component available but not re-exported with route helpers. | Low – doc completeness. | Provide guidance/utility for route-level use as part of refactor. |
| `apps/cyberstorm-remix/cyberstorm/utils/errors/*` | No changes required (up-to-date). | Low | None. |

## Action Plan
1. Document recommended fallback copy (title/description/labels) and apply via `NimbusErrorBoundary` props where appropriate.
2. Update root layout and every major route listed to wrap content with `NimbusErrorBoundary`.
3. Retain or refine existing specialised fallbacks (e.g. community header) while ensuring entire route is covered.
4. Validate via targeted navigation smoke tests and `pnpm lint`/focused vitest suites.
