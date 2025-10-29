# User-Facing Error Handling Review – Findings

## 1. StrongForm guardrails return plain `Error`
- **Files affected:** `apps/cyberstorm-remix/app/p/components/ReportPackage/ReportPackageForm.tsx`, `apps/cyberstorm-remix/app/p/packageEdit.tsx`, `apps/cyberstorm-remix/app/p/tabs/Wiki/WikiNewPage.tsx`, `apps/cyberstorm-remix/app/p/tabs/Wiki/WikiPageEdit.tsx`, `apps/cyberstorm-remix/app/settings/teams/**`, `apps/cyberstorm-remix/app/settings/user/Account/Account.tsx`, and any other consumer formatting `UserFacingError` via `formatUserFacingError`.
- **What happens:** `useStrongForm` (`apps/cyberstorm-remix/cyberstorm/utils/StrongForm/useStrongForm.ts`) still throws vanilla `Error` objects for local guard conditions (double submits, refining state, refine errors) before mapping remote failures to `UserFacingError`. When these reach `formatUserFacingError`, both `headline` and `description` are undefined, so toasts/modals display blank messages.
- **Consequence:** User-visible regression whenever a form hits those guard rails (e.g., double-clicking “Save”) because the helper now expects a `UserFacingError`.
- **Resolution:** `useStrongForm` now converts internal guardrail failures into `UserFacingError` instances before emitting them, so downstream toasts receive human-readable headlines.

## 2. `handleLoaderError` loses bespoke not-found copy
- **Files affected:** `apps/cyberstorm-remix/app/p/packageEdit.tsx`, `apps/cyberstorm-remix/app/settings/teams/team/tabs/{Members,Profile,ServiceAccounts,Settings}/Members.tsx`, `apps/cyberstorm-remix/app/settings/teams/team/teamSettings.tsx`, and similar loaders that replaced explicit `ApiError` checks with `handleLoaderError`.
- **What happens:** Legacy code threw `new Response("Package not found", { status: 404 })` (or team-specific messages). After refactoring, these catch blocks call `handleLoaderError`, which maps an `ApiError` via `mapApiErrorToUserFacingError` and rethrows immediately. The route-specific `throwUserFacingPayloadResponse({ headline: "Package not found.", ... })` that follows is now unreachable for API-driven 404s.
- **Consequence:** UI no longer shows the tailored copy we added; it falls back to sanitized API text (“The requested resource was not found.”) without category-specific context.
- **Resolution:** Each affected loader now checks for `ApiError` 404 responses and rethrows the tailored `throwUserFacingPayloadResponse` payload before delegating unexpected errors to `handleLoaderError`.
