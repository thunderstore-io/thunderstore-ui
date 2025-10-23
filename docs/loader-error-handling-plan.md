# Loader Error Handling Plan

## Goals
- Deliver consistent, user-friendly messaging for loader and action failures across the cyberstorm Remix app.
- Reuse shared utilities so future routes automatically benefit from structured `UserFacingError` payloads.
- Ensure API client helpers provide contextual not-found errors that can be surfaced directly in the UI.

## Implementation Steps
1. **API error helpers**: Extend `packages/thunderstore-api/src/errors/userFacingError.ts` with `createResourceNotFoundError` so 404 responses emit predictable headlines, descriptions, and context.
2. **Team API fetchers**: Update `fetchTeamDetails`, `fetchTeamMembers`, and `fetchTeamServiceAccounts` to wrap 404 responses with `createResourceNotFoundError`, preserving team identifiers for the UI.
3. **Shared loader handling**: Add `handleLoaderError` under `apps/cyberstorm-remix/cyberstorm/utils/errors/` to funnel both `ApiError` and `UserFacingError` instances through `throwUserFacingErrorResponse` while leaving native `Response` objects untouched.
4. **Route loaders**: Refactor Remix loaders (team settings tabs, package edit flows, and other routes previously using inline `ApiError` checks) to call `handleLoaderError`, while leaving bespoke `throwUserFacingPayloadResponse` cases for explicit copy.
5. **Error boundary polish**: Adjust the root ErrorBoundary so payload descriptions always win and fallback text is deduplicated against the headline, preventing repeated “Not found” messaging.
6. **Documentation**: Maintain this plan within `docs/loader-error-handling-plan.md` for quick onboarding and future expansion (e.g., auditing remaining loaders, adding automated tests).

## Follow-Up Ideas
- Broaden the loader audit to cover all Remix routes (communities, upload) and migrate them to `handleLoaderError`.
- Add Vitest coverage for `handleLoaderError` and the new API error helper to guard against regressions.
- Consider centralized logging/Sentry hooks before `handleLoaderError` rethrows so production diagnostics retain full context.
