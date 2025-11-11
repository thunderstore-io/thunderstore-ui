# Error Handling

This document provides a concise overview of the error handling strategy used in the Cyberstorm Remix application. The goal is to provide consistent, user-friendly error messages and robust error isolation.

## Core Concepts

Our error handling is built around a few key concepts:

-   **`handleLoaderError`**: A utility for normalizing errors within Remix loaders.
-   **`UserFacingError`**: A structured error format for communicating user-friendly error details from the API/backend to the UI.
-   **`NimbusErrorBoundary`**: A React error boundary to gracefully handle rendering errors in components.

---

## `handleLoaderError`

All Remix loaders that fetch data from the API should use the `handleLoaderError` utility to ensure errors are handled consistently. It catches errors from Dapper, maps them to `UserFacingError` payloads, and throws a `Response` that can be caught by the route's `ErrorBoundary`.

### Usage

Wrap your data-fetching logic in a `try...catch` block and call `handleLoaderError` in the `catch` block.

```typescript
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
  // ...
}
```

-   **Source**: [`apps/cyberstorm-remix/cyberstorm/utils/errors/handleLoaderError.ts`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/handleLoaderError.ts)
-   **Example**: [`apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx`](../../apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx)

### Error Handling in `loader` vs. `clientLoader`

There is a notable difference in how errors are handled between `loader` and `clientLoader` functions.

-   **`loader` (Server-side):** Errors are consistently processed through `handleLoaderError`. This utility catches errors from API calls (e.g., from Dapper), maps them to structured `UserFacingError` payloads, and throws a `Response`. This ensures that errors are standardized before they reach the UI, allowing for consistent presentation in the route's `ErrorBoundary`.

-   **`clientLoader` (Client-side):** Error handling is less standardized. `clientLoader` functions often do not use `handleLoaderError`. Instead, they might:
    -   Throw a generic `Error` object.
    -   Have no explicit `try...catch` block, letting promise rejections from API calls be caught by the nearest Remix error boundary.

This can lead to less specific error messages for the user. The recommendation is to apply the same `try...catch` and `handleLoaderError` pattern in `clientLoader` as is used in `loader` to ensure a consistent user experience.

#### Bad Example (`clientLoader` without `handleLoaderError`)

```typescript
// This is not recommended
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const { dapper } = getLoaderTools();
  try {
    const team = await dapper.getTeam(params.teamId);
    // Awaiting all follow-up data forces the UI to block on the clientLoader.
    const members = await dapper.getTeamMembers(params.teamId);
    return { team, members };
  } catch (error) {
    // Errors will bubble to Remix but we miss the user-facing payload mapping.
    throw error;
  }
}
```

#### Good Example (`clientLoader` with `handleLoaderError`)

```typescript
// This is the recommended approach
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const { dapper } = getLoaderTools();

  let team;
  try {
    // Await the first fetch only because the follow-up request depends on it.
    team = await dapper.getTeam(params.teamId);
  } catch (error) {
    // This provides a consistent, user-facing error.
    handleLoaderError(error);
  }

  // Kick off dependent work without awaiting so Suspense can resolve it downstream.
  const members = dapper.getTeamMembers(team.slug);

  return {
    team,
    members,
  };
}
```

---

## `UserFacingError`

When an error is thrown, `handleLoaderError` uses `throwUserFacingPayloadResponse` to create a `Response` with a JSON payload containing a `UserFacingError`. This structured error object ensures that the UI can present a helpful message.

The `UserFacingError` interface is defined in the `thunderstore-api` package.

```typescript
// packages/thunderstore-api/src/errors/userFacingError.ts
export interface UserFacingError {
  headline: string;
  description?: string;
  category?: UserFacingErrorCategory;
  status?: number;
  context?: Record<string, unknown>;
}
```

-   **Definition**: [`packages/thunderstore-api/src/errors/userFacingError.ts`](../../packages/thunderstore-api/src/errors/userFacingError.ts)
-   **Response Helper**: [`apps/cyberstorm-remix/cyberstorm/utils/errors/userFacingErrorResponse.ts`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/userFacingErrorResponse.ts)

---

## React Router Related Error Handling

### Usage in ErrorBoundary

A route's `ErrorBoundary` can use `resolveRouteErrorPayload` to parse the error from the `Response` and render a user-friendly message.

```typescript
// apps/cyberstorm-remix/app/some-route.tsx
import { useRouteError } from "react-router";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { NimbusErrorBoundaryFallback } from "cyberstorm/utils/errors/NimbusErrorBoundary";

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
```

### Usage with Suspense & `Await`

When handing promises to the UI, wrap the consuming view with `Suspense`/`Await` and provide `NimbusAwaitErrorElement` as the `errorElement`. This ensures promise rejections render the same Nimbus fallback instead of crashing the tree.

```tsx
// apps/cyberstorm-remix/app/p/tabs/Readme/Readme.tsx
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

---

## `NimbusErrorBoundary`

`NimbusErrorBoundary` is a crucial component for preventing a UI crash in one part of the page from taking down the entire application. It's a React Error Boundary that catches rendering errors in its children and displays a fallback UI.

### Root Error Boundary

The entire application is wrapped in `NimbusErrorBoundary` in `root.tsx` to catch any unhandled rendering errors.

```tsx
// apps/cyberstorm-remix/app/root.tsx
import { NimbusErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export default function App() {
  // ...
  return (
    <NimbusErrorBoundary
      fallback={AppShellErrorFallback}
      onReset={reloadDocument}
    >
      <Layout>
        <Outlet />
      </Layout>
    </NimbusErrorBoundary>
  );
}
```

### Route-level Error Boundary

Remix routes can export an `ErrorBoundary` which will render when a loader or action throws an error. We use `NimbusDefaultRouteErrorBoundary` to provide a consistent look and feel.

```tsx
// apps/cyberstorm-remix/app/p/tabs/Changelog/Changelog.tsx
import { NimbusDefaultRouteErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export const ErrorBoundary = NimbusDefaultRouteErrorBoundary;
```

### Granular Component Boundary

You can also wrap a single component with `NimbusErrorBoundary` to isolate its failures.

```tsx
// Example of wrapping a specific component
import { SomeRiskyComponent } from "./SomeRiskyComponent";
import { NimbusErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export default function MyComponent() {
  return (
    <div>
      <h1>My Page</h1>
      <NimbusErrorBoundary
        title="A component has failed"
        description="This part of the page couldn't be loaded. Please try again."
      >
        <SomeRiskyComponent />
      </NimbusErrorBoundary>
      <p>Other content on the page that will still render.</p>
    </div>
  );
}
```

-   **Source**: [`apps/cyberstorm-remix/cyberstorm/utils/errors/NimbusErrorBoundary/NimbusErrorBoundary.tsx`](../../apps/cyberstorm-remix/cyberstorm/utils/errors/NimbusErrorBoundary/NimbusErrorBoundary.tsx)
-   **Root Usage**: [`apps/cyberstorm-remix/app/root.tsx`](../../apps/cyberstorm-remix/app/root.tsx)
