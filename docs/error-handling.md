# Error Handling

This document summarizes the Cyberstorm Remix error-handling strategy so every route surfaces consistent, user-friendly failures.

The guidance is split into three layers:

1. **Server loaders** – how to normalize API failures before they reach the UI.
2. **Client loaders** – how to stream data to Suspense while preserving the same user-facing payloads.
3. **Error boundaries** – how Nimbus components keep rendering errors isolated.

---

## Server Loaders

Server-side Remix `loader` functions must always translate thrown errors into `UserFacingError` payloads. Use `handleLoaderError` for every API call so mapped HTTP codes always render the same text.

### `handleLoaderError`

`handleLoaderError` accepts any unknown error, looks up optional mappings, and throws a `Response` created by `throwUserFacingPayloadResponse`.

-   **Source**: [`cyberstorm/utils/errors/handleLoaderError.ts`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/handleLoaderError.ts)
-   **Response helper**: [`cyberstorm/utils/errors/userFacingErrorResponse.ts`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/userFacingErrorResponse.ts)

```tsx
// apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    try {
      const readme = await dapper.getPackageReadme(
        params.namespaceId,
        params.packageId
      );
      return { readme };
    } catch (error) {
      handleLoaderError(error);
    }
  }

  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    category: "not_found",
    status: 404,
  });
}
```

#### Why every loader uses it

The phrase “all Remix loaders” includes *both* server `loader`s and client `clientLoader`s. Wrapping API calls this way guarantees:

-   Users always see the same copy (via shared mappings such as `packageNotFoundMappings`).
-   Default mappings continue to work when route code omits explicit options; `handleLoaderError` now merges `defaultErrorMappings` with any route-specific overrides before searching for a match.
-   Any unrecognized exception still flows through `throwUserFacingErrorResponse`, so the `ErrorBoundary` has structured data.

### `UserFacingError`

`handleLoaderError` ultimately throws a JSON payload shaped like `UserFacingError`, defined in [`packages/thunderstore-api`](../../packages/thunderstore-api/src/errors/userFacingError.ts). Each payload contains a `headline`, optional `description`, and any context needed by Nimbus error boundaries.

---

## Client Loaders

Client loaders stream data to the browser but should produce the same payloads and tone as their server counterparts. Treat them exactly like server loaders:

1. Validate required params (`namespaceId`, `teamName`, etc.) and throw `throwUserFacingPayloadResponse` immediately when missing.
2. Call `getLoaderTools()` so you reuse the configured `DapperTs` instance *and* hydrated session tools. The helper now returns `{ dapper, sessionTools }` for client and server paths.
3. Wrap awaited work in `try/catch` and delegate to `handleLoaderError`. For Promises you hand off to Suspense, attach `.catch(error => handleLoaderError(error, { mappings }))` so rejections surface Nimbus copy.
4. Share error-mapping constants between server and client loaders to prevent drift.

### Example pattern

```tsx
const teamNotFoundMappings = [
  createNotFoundMapping(
    "Team not found.",
    "We could not find the requested team.",
    404
  ),
];

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  if (params.communityId && params.namespaceId) {
    const { dapper } = getLoaderTools();
    const page = parseIntegerSearchParam(new URL(request.url).searchParams.get("page"));

    return {
      filters: dapper
        .getCommunityFilters(params.communityId)
        .catch((error) => handleLoaderError(error, { mappings: teamNotFoundMappings })),
      listings: dapper
        .getPackageListings(
          { kind: "namespace", communityId: params.communityId, namespaceId: params.namespaceId },
          PackageOrderOptions.Updated,
          page
        )
        .catch((error) => handleLoaderError(error, { mappings: teamNotFoundMappings })),
    };
  }

  throwUserFacingPayloadResponse({
    headline: "Community not found.",
    description: "We could not find the requested community.",
    category: "not_found",
    status: 404,
  });
}
```

> **Tip:** Client loaders should only `await` dependent work (for example, when the second call needs data from the first). Everything else can be returned as promises so `<Suspense>` renders immediately.

---

## Error Boundaries

Rendering errors are isolated with Nimbus components so a failure in one subtree never crashes the entire shell. Treat React Router error primitives and Nimbus helpers as a single toolkit.

### Route-level boundaries

Every Remix route exports `ErrorBoundary = NimbusDefaultRouteErrorBoundary` (or a custom component that delegates to `NimbusErrorBoundaryFallback`). When a loader throws a `UserFacingError`, call `resolveRouteErrorPayload` inside the boundary to access the structured payload.

```tsx
import { useRouteError } from "react-router";
import {
  NimbusDefaultRouteErrorBoundary,
  NimbusErrorBoundaryFallback,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NimbusErrorBoundaryFallback
      error={error}
      title={payload.headline}
      description={payload.description}
    />
  );
}

export const DefaultRouteBoundary = NimbusDefaultRouteErrorBoundary;
```

### Suspense + `Await`

When a loader returns promises, wrap the consuming UI with `<Suspense>` and `<Await>` so loader errors resolve through Nimbus’ Suspense-aware helpers instead of crashing React Router.

```tsx
import { Suspense } from "react";
import { Await } from "react-router";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { NimbusAwaitErrorElement } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export function ReadmeContent({ readme }: { readme: Promise<string> }) {
  return (
    <Suspense fallback={<SkeletonBox />}>
      <Await resolve={readme} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedReadme) => <ReadmeRenderer markdown={resolvedReadme} />}
      </Await>
    </Suspense>
  );
}
```

### Granular component boundaries

`NimbusErrorBoundary` can also wrap individual components when you need localized retries or messaging.

```tsx
import { NimbusErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export function MyComponent() {
  return (
    <NimbusErrorBoundary
      title="A component has failed"
      description="This part of the page couldn't be loaded. Please try again."
      retryLabel="Retry block"
    >
      <SomeRiskyComponent />
    </NimbusErrorBoundary>
  );
}
```

The full implementation lives in [`cyberstorm/utils/errors/NimbusErrorBoundary/NimbusErrorBoundary.tsx`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/NimbusErrorBoundary/NimbusErrorBoundary.tsx), and the app shell wires it up in [`app/root.tsx`](../../apps/cyberstorm-remix/app/root.tsx).

---
