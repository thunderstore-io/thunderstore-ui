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

## Implementation Plan by Layer
1. **thunderstore-api**
   - Extend `ApiError` with `statusCode`, `statusText`, `responseBody`, and optional `serverMessage` getters.
   - Add `ApiErrorCategory` inference (`auth_required`, `session_expired`, `validation`, `permission`, `rate_limit`, etc.) based on status code and response JSON keys.
   - Add a dedicated `sanitizeServerDetail(message: string)` helper to ensure server-provided detail strings are safe before any UI rendering.
   - Export the `mapApiErrorToUserFacingError` helper (with no React dependencies) so any consumer can use it, and ensure it relies on the sanitiser when using server-provided text.
   - Provide typed error classes for network and timeout scenarios (wrap fetch errors).
2. **ts-api-react**
   - Update `useApiCall` to catch errors, call the translator, and rethrow a `UserFacingError` instance (while preserving original error via `originalError`). Offer opt-out for call sites that need raw errors.
   - Ensure session tooling marks `sessionWasUsed` so `ApiError` can categorise stale sessions and surface the correct guidance.
3. **ts-api-react-actions**
   - Change default `onSubmitError` to receive `UserFacingError` and show a toast via `useFormToaster` if the caller does not override. Provide helpers for inline rendering.
   - Propagate `UserFacingError` back to callers so components can branch on `category` instead of string comparisons.
4. **cyberstorm utils (`useStrongForm`, `useFormToaster`)**
   - Accept an optional `errorMapper`, defaulting to the shared translator. When an error is provided, set `inputErrors` if `category === "validation"` and present `headline/description` elsewhere.
   - Replace `Error occurred: …` fallback with `error.headline` and only append `description` when present.
5. **UI Components (example: `ReportPackageForm`)**
   - Remove manual `if (error.message === "401: Unauthorized")` logic. Instead, handle categories: auth → show CTA and maybe link to login; validation → highlight fields; server → general message plus log ID.
   - For toasts, feed `UserFacingError` to a common presenter that picks copy, deferring login-modal orchestration to the React Router stack.
6. **Dapper & Loaders**
   - Wrap Dapper fetches so any thrown error is translated once. React Router loaders/clientLoaders should throw a serialisable `UserFacingError` payload using `json()` with status code for HTTP response.
   - Update the root error boundary to detect this shape and render consistent fallback UI (with optional retry/sign-in actions).
7. **Copy Governance**
   - Centralise default strings in a single module (e.g. `packages/cyberstorm-forms/src/errorMessages.ts`). Document guidelines for UX tone and consistency.

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

## Testing & Verification
- **Unit**: Cover translators, `ApiError` metadata, and presenter helpers.
- **Integration**: Vitest tests around `useStrongForm` to ensure UI receives correct `headline`/`description` given mocked errors.

## Open Questions
- Should we expose a generic `action` callback (e.g. open login modal) alongside URL-based CTA? **Decision**: Not required; React Router will handle auth-driven modals later.
- How do we support localisation down the line? **Decision**: i18n is out of scope for this project.
- Do we need to respect server-provided `detail` text verbatim, or sanitise/shorten it for UX consistency? **Decision**: Sanitize all server-provided strings via a dedicated `sanitizeServerDetail` helper before display.

---

**New file**: `docs/error-handling-plan.md`
