# Thunderstore Error Experience Improvement Plan

## Context & Current Flow
- **User action**: Components such as `ReportPackageForm` call `useStrongForm`, which wraps submission via `packageListingReport`.
- **Form handler (`useStrongForm`)**: On failure, it forwards the raw `Error` to `onSubmitError` without categorisation.
- **API call chain**: `packageListingReport` → `apiFetch` → `fetchRetry`. When the server returns a failing HTTP status, `ApiError.createFromResponse` builds a message like `"Authentication required. Please sign in."` and attaches the `Response`.
- **UI message**: Many forms (including `ReportPackageForm`) build a toast string the pattern `Error occurred: ${error.message}` and only override specific strings (e.g. legacy `"401: Unauthorized"`). After recent improvements, the comparison misses, so the fallback verbose message reaches the user.
- **Global patterns**: The same fallback string appears across forms, `ApiAction` callbacks, React Router loaders, and Dapper data hooks.

## Pain Points Discovered
- **String matching brittleness**: Dozens of components compare `error.message` against hard-coded values, making UX copy tightly coupled to backend text.
- **No user-facing classification**: We lack a canonical way to indicate "auth required", "validation problem", or "server down"; each surface invents its own text.
- **Duplicated copy & inconsistent tone**: Toasts, inline alerts, and error boundaries all render different language for the same scenario.

## Target Experience
1. **Consistent semantics**: Every client-visible error is described by a `UserFacingError` contract containing status, category, primary message, optional resolution hint, and telemetry context.
2. **Layered handling**:
   - `thunderstore-api`: exposes raw error metadata plus a helper for converting to `UserFacingError`.
   - `ts-api-react` & `ts-api-react-actions`: normalise thrown errors before reaching React components.
   - `useStrongForm`/`useFormToaster`: consume `UserFacingError` and render context-appropriate copy.
   - Route loaders/actions & Dapper wrappers: convert server failures to `UserFacingError` and throw/return structured payloads consumable by error boundaries.
3. **Copy centralisation**: Provide map of default strings while still allowing views to override.

## Proposed Interfaces
- **`UserFacingError`** (new shared type, e.g. under `packages/thunderstore-api/src/errors/UserFacingError.ts`):
  ```ts
  type UserFacingErrorCategory = "auth" | "validation" | "not_found" | "rate_limit" | "server" | "network" | "unknown";
  interface UserFacingError {
    category: UserFacingErrorCategory;
    status?: number;
      headline: string;      // Short CTA-friendly message
      description?: string;  // Optional detail for modals or alerts
    originalError: Error;  // Preserves stack/message for logging
    context?: Record<string, unknown>;
  }
  ```
- **Error translator**: `mapApiErrorToUserFacingError(error: unknown, options)` that inspects `ApiError`, `TypeError` (network), `RequestBodyParseError`, etc., returning a populated `UserFacingError`. Options allow callers to specify surface (toast/inline) and customise copy as needed.
- **Presenter hooks**: `useErrorPresenter` in `cyberstorm-forms` that accepts `UserFacingError` and selects toast vs inline copy.

## Execution Plan
1. **Shared Translator Audits**: Validate that `packages/thunderstore-api/src/errors` (including `sanitizeServerDetail`, `mapApiErrorToUserFacingError`, and `formatUserFacingError`) expose everything cyberstorm-remix and Dapper consumers require, with safe defaults.
2. **Hook Layer Consistency**: Ensure `useApiCall`, `ApiAction`, `useStrongForm`, and `useFormToaster` always surface `UserFacingError` objects, respect the formatter, and continue to capture validation metadata.
3. **Remix Surface Sweep**: Update `apps/cyberstorm-remix/app/**` forms/actions to consume the formatter, remove legacy `error.message` strings, and wire `inputErrors` for validation paths.
4. **Loader & Boundary Integration**: Propagate translation through Dapper wrappers and Remix loaders/actions so route-level failures deliver structured payloads that the root error boundary can present cleanly.
5. **Docs & Tests**: Expand unit/integration coverage plus contributor guidance (`docs/error-handling-plan.md`, Vitest suites) to lock behaviour and keep package consumers aligned.

## Delivery Phases
1. **Foundations**: Implement translator, `UserFacingError`, and updated error classes in `thunderstore-api`. Add unit tests mirroring scenarios: stale session, malformed payload, rate limit, server crash.
2. **Shared Hooks**: Update `ts-api-react`, `ts-api-react-actions`, `useStrongForm`, `useFormToaster`. Provide migration docs for teams adopting new contract.
3. **Surface Rollout**: Migrate high-impact flows (package reporting, uploads, team management) to the new error presenter. Remove string equality logic and rely on categories.
4. **Route & Loader Consistency**: Update loaders/actions and error boundaries to emit/present `UserFacingError` shapes. Ensure Dapper consumers adopt the translator.
5. **Cleanup**: Search for legacy `"Error occurred:"` or direct `error.message` comparisons and replace with category-based handling. Document best practices in the developer guide.

## Progress Log
- **2025-10-23**
   - *Foundations*: `packages/thunderstore-api` now ships `sanitizeServerDetail`, the `UserFacingError` class, and `mapApiErrorToUserFacingError`; associated unit tests cover translator behaviour.
   - *Shared Hooks*: `ts-api-react` / `ts-api-react-actions` now normalise errors to `UserFacingError`; `useStrongForm` rewritten to consume the mapper, capture validation errors, and surface `headline`/`description` to callers.
   - *Surface Rollout*: `ReportPackageForm`, `packageEdit`, and initial toaster helpers now display friendly copy; additional forms (e.g. uploads, team settings) still use legacy messages pending follow-up.
- **2025-10-29**
   - *Shared Hooks*: Introduced `formatUserFacingError` and updated `useFormToaster` to consume it, consolidating toast copy generation around `headline`/`description` semantics.
   - *Surface Rollout*: Migrated upload, account deletion, and team creation flows to rely on `UserFacingError` plus the formatter; removed remaining `"Error occurred"` fallbacks across Remix app forms.

## Testing & Verification
- **Unit**: Cover translators, `ApiError` metadata, and presenter helpers.
- **Integration**: Vitest tests around `useStrongForm` to ensure UI receives correct `headline`/`description` given mocked errors.

## Open Questions
None at this time; UX-specific CTAs and cross-package adoption will be revisited after the core rollout.

---

**New file**: `docs/error-handling-plan.md`
