# Error Handling Staged Changes Audit

**Date:** 2025-11-06
**Branch:** 10-23-improve_api_error_handling_and_surface_user-facing_errors
**Scope summary:** Large staged refactor introducing Nimbus UI error boundaries, expanded loader error utilities, and updated API/user-facing error plumbing across React apps and shared packages.

## Impact Overview
- Extensive UI updates across package, community, wiki, and settings routes to surface user-facing errors consistently.
- New Nimbus error boundary component and supporting styles wired into the Remix app shell.
- New shared error resolution utilities and StrongForm updates to normalise loader error handling.
- Thunderstore API SDK and React bindings updated to expose sanitised user-facing error responses with tests.
- Documentation and agent instructions expanded to codify the error-handling strategy.

## Risk Assessment
| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/commonComponents/NimbusErrorBoundary/* | New reusable error boundary + fallback implementation. | Medium – needs accessibility review, retry semantics verification, and JSDoc polish. | Review component API docs/tests, ensure fallback copy & console logging policies match expectations, add story/test coverage if missing. |
| apps/cyberstorm-remix/app/root.tsx & high-traffic routes (`app/p/**`, `app/c/**`, settings, upload) | Wide adoption of new boundary + error payload mapping. | High – large behavioural surface; regression potential around data loading and retry flows. | Audit each route for loader/action wiring, confirm suspense/resource guards, add targeted smoke tests, verify CSS class names and responsive behaviour. |
| apps/cyberstorm-remix/app/upload/upload.tsx | Loader/client loaders wrap Dapper calls with `handleLoaderError`; Suspense surfaces `LoaderErrorPayload` alerts and toasts drive polling UX. | Medium – complex workflow with background polling/toasts; risk of duplicate polling errors and missing context in retries. | Add integration test covering failed community fetch and submission polling error path, ensure toast messaging pulls from mapped payloads (2025-11-06). |
| apps/cyberstorm-remix/app/p/dependants/Dependants.tsx | Multiple parallel loaders use shared mappings; Suspense renders alerts when `LoaderResult` resolves with errors. | Medium – dependent on consistent mapping configuration; risk of mismatched query params or missing includeContext for auth states. | Add loader integration test validating auth/not-found mappings, confirm `resolveLoaderPromise` rejects unexpected shapes, document required query params (2025-11-06). |
| apps/cyberstorm-remix/cyberstorm/utils/errors/* | Loader error mapping/resolution helpers with unit coverage for `handleLoaderError`, `resolveRouteErrorPayload`, and `userFacingErrorResponse`. | Medium – foundational logic; still needs integration validation across route loaders. | Confirm tree-shaking and import paths, extend integration tests for representative routes, backfill end-to-end checks for loader callers (2025-11-06). |
| apps/cyberstorm-remix/cyberstorm/utils/StrongForm/useStrongForm.ts | StrongForm now emits user-facing errors. | Medium – form UX risk; could leak internal details or break toasts. | Verify JSDoc, ensure toaster integration, add test for new error shape, confirm backwards compatibility. |
| packages/thunderstore-api/src/** | API client sanitises server errors and exports helpers + tests. | High – affects all consumers; must guarantee no breaking change to existing callers. | Review type changes, update changelog, expand tests for varied payloads, confirm network error handling pathways. |
| packages/ts-api-react*/src/** | React hooks/actions now propagate user-facing errors. | Medium – hook signatures/states changed; risk of missing consumers. | Audit use sites, update JSDoc, add regression tests for pending/error states, document migration guidance. |
| packages/dapper-ts/src/** & packages/dapper/src/types/shared.ts | Minor adjustments to communities/listings DTOs. | Low – incremental typing changes. | Verify generated API contract alignment, run dts lint if applicable. |
| packages/cyberstorm-forms/src/useFormToaster.ts | Toaster now handles user-facing payload. | Low – limited surface but visible UX. | Smoke test manual flows, ensure default copy matches design tokens. |
| docs/* (error handling plans/audits) & AGENTS.md | Multiple new guidance documents. | Low – documentation accuracy risk. | Cross-check content for duplication, ensure references match final implementation, confirm AGENTS.md instructions align with repo standards. |

## Cleanup & Quality Plan
1. **Baseline validation** – Run `pnpm install` (if needed) followed by `pnpm lint`, `pnpm test --filter thunderstore-api`, and targeted Remix/UI test suites to ensure no immediate regressions. (Note: `yarn lint` fails because the command is not defined; use `pnpm`. When running Vitest, prefer direct file targets such as `pnpm vitest run apps/cyberstorm-remix/cyberstorm/utils/errors/__tests__/handleLoaderError.test.ts` until the full test suite is stabilised.)
2. **Documentation pass** – Align staged docs (`docs/error-handling-*.md`) with the implemented code, ensure tables capture final state, and update any TODOs discovered during review.
3. **Code review sweep** – For each high-risk area above, verify JSDoc completeness, guard clauses, accessibility considerations, and adherence to coding standards (imports, naming, side-effect safety).
4. **Targeted refactors** – Address any identified cleanliness issues (e.g., duplicated error handling logic, unreachable branches, missing unit helpers) before commit splitting.
5. **Testing additions** – Expand automated coverage: add unit tests for `cyberstorm/utils/errors` helpers (initial coverage added and verified via `pnpm vitest run apps/cyberstorm-remix/cyberstorm/utils/errors/__tests__/handleLoaderError.test.ts`; Playwright binaries must be installed with `pnpm exec playwright install` beforehand; broader Vitest runs currently fail against remote API dependencies and need isolation), integration/smoke tests for key Remix routes, and Storybook visual regression for the Nimbus boundary where practical.
6. **Release notes** – Draft SDK/API change notes (especially for `packages/thunderstore-api` and `ts-api-react*`) to communicate error object changes to downstream consumers.

## Commit Breakdown Plan
1. Repository meta/docs (`AGENTS.md`, `docs/*` guidance).
2. Shared error utility layer (`cyberstorm/utils/errors/*`, `useStrongForm.ts`).
3. Nimbus error boundary component + styles + index export.
4. App integration updates grouped by feature area (e.g., `app/root.tsx` + package routes, community routes, settings/upload).
5. SDK updates (`packages/thunderstore-api/**` + tests + new exports).
6. React bindings (`packages/ts-api-react*/**`).
7. Ancillary client updates (`packages/dapper-ts`, `packages/cyberstorm-forms`).

Each commit should include corresponding tests/docs updates and pass lint/test checks independently.
