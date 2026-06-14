# Data Fetching and Error Handling

React Router has two methods for fetching data for "route components", i.e. components that are mapped to a specific URL path in `routes.ts`. To fetch data on server side, `loader()` is used, whereas `clientLoader()` is used on client side.

`cyberstorm-remix` uses mostly DapperTs library for fetching the data inside the loaders. However, there are slight differences in how DapperTs should be used to ensure proper Promise and Error handling.

## SSR `loader()`

- User session is available only on client side, so any API requests are made as an unauthenticated user. Therefore there's no point in implementing `loader()` for a route that requires authentication.
- `loader()` should always `await` the Promise returned from the DapperTs query method.
- `loader()` should throw `Response` objects when data fetching fails to ensure proper error handling.
  - `ssrLoader()` higher-order function should be used to ensure `ApiError`s are cast to `Response`s.

## `clientLoader()`

- DapperTs makes API requests as an authenticated or unauthenticated user depending on the user session and the route in question.
- To deduplicate requests from different components to the same endpoint, `clientLoader()` should use `getDapperForRequest()` helper. For consistency's sake it should be used even if there's no need for deduplication.
- `clientLoader()` should return pending Promises by default. Promises should be awaited inside `clientLoader()` only if the value is used by it internally.
- If `clientLoader()` returns pending Promises, the component should use `<Suspense>` and `<Await>` to wrap elements that depend on those pieces of the data.
  - Note that if `<Await>` defines `errorElement` prop, it is rendered instead of exported `RouteErrorBoundary`.

## RouteErrorBoundary

- `RouteErrorBoundary` provides a simple default error boundary for catching errors in loaders. In practice they should be used with components that implement `loader` and/or `clientLoader`.
- The root component of the app contains this error boundary as a fallback in case subcomponents don't. However, e.g. for pages with tabs, it's better UX to have another error boundary on the tab component to minimize the impact of errors.
- Using `RouteErrorBoundary` is as simple as exporting it from the route component file under the name `ErrorBoundary`, e.g:

```typescript
export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";
```

## Granular, in-place errors (`FetchErrorState`)

`RouteErrorBoundary` is all-or-nothing: a single failed fetch replaces the whole
page. When a page is composed of several independent data sources, one failing
source should not deadlock the rest of the page. Instead, render an in-place
error — with a **retry** — only for the region whose data failed (TS-3397).

The building block is
[`FetchErrorState`](../app/commonComponents/FetchErrorState/FetchErrorState.tsx):
an inline alert with a retry button. By default the retry calls
`useRevalidator().revalidate()`, which re-runs the route loaders and re-resolves
the deferred promise behind the nearest `<Await>`, letting the region recover
without a full navigation. Pass a custom `onRetry` to re-fetch a single source.

**This manual retry is the recovery path — the API client does not auto-retry.**
`thunderstore-api`'s `apiFetch` makes exactly one network attempt and surfaces
the failure (see the note in `packages/thunderstore-api/src/apiFetch.ts`). A
blanket client-side retry was removed because it amplifies backend load during
an outage (every client re-firing N times → accidental DDoS) and could duplicate
non-idempotent writes. So a failed fetch fails fast and waits for the user (or a
revalidation) to retry, rather than hammering the origin on its own.

Two ways to use it:

1. **As an `<Await errorElement>`** for a deferred fetch — the most common case:

   ```tsx
   <Suspense fallback={<SkeletonBox />}>
     <Await
       resolve={listings}
       errorElement={<FetchErrorState message="Couldn't load packages." />}
     >
       {(resolved) => /* ... */}
     </Await>
   </Suspense>
   ```

   When several `<Await>`s resolve the **same** promise (e.g. a list plus its
   count and pagination), give only the primary one a visible `FetchErrorState`
   and the rest `errorElement={<></>}`, so a single failure doesn't stack
   duplicate errors. (Omitting `errorElement` re-throws to the route boundary —
   the white-screen we are trying to avoid — so always set it, even if empty.)

2. **In place of a non-deferred region** whose data is optional/non-fatal. Make
   the data non-fatal in the loader (catch the error and return a sentinel such
   as `null`) so the route does not throw, then branch on it in the component.
   `PackageSearch` does this for community filters: a failed `getCommunityFilters`
   becomes `filters: null`, the package list still loads with the default
   section, and the filters column renders a `FetchErrorState` with retry.

## About Hydration and Loaders

Hydration in this context means the browser-side process where React/React-Router are attached to the static HTML snapshot returned by the server. This takes over e.g. DOM management and navigation, making the static HTML interactive. The flow of this process is as follows:

1. When entering the page via "hard load" (e.g. direct URL, page refresh), the server matches the route, runs `loader` (if defined), and returns the rendered HTML.
2. Browser displays the SSR HTML immediately.
3. Browser loads JS bundles and starts hydration.
4. During hydration, `clientLoader` runs only if `loader` was not defined or `clientLoader.hydrate=true` is set.
5. Once hydration completes the page is fully interactive, causing client-side navigation to act as "soft load":
    - If the target route has a `clientLoader`, it runs on the browser. `loader` is not invoked by default.
    - If the target route has only SSR `loader`, a request is sent to the server, which executes the `loader` and returns the data (only the data, not full HTML).

## Example

```typescript
import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";

// This component is now wrapped in the default error boundary.
export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

// Provides data for server side rendering. Used on "hard load", i.e. when
// entering the page with direct URL. Used also on client side navigation, but
// only if clientLoader() is not defined.
export const loader = ssrLoader(
  async ({ params }: LoaderFunctionArgs) {
    const { communityId } = params;

    if (!communityId) {
      throw new Response("Community not found", { status: 404 });
    }

    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => ({
      apiHost: publicEnvVariables.VITE_API_URL,
    }));

    // Await data returned by dapper.
    return {
      community: await dapper.getCommunity(communityId),
    };
  }
);

// Provides data for client side rendering. Used on "soft load", i.e. when
// navigating to the page from another page within the app. Used also on hard
// load if loader() is not defined or clientLoader.hydrate is set to true.
export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  const { communityId } = params;

  if (!communityId) {
    throw new Response("Community not found", { status: 404 });
  }

  // Singleton instance that deduplicates multiple requests to same API
  // endpoint triggered by stacked route components.
  const dapper = getDapperForRequest(request);

  // Do not await data returned from clientLoader() unless the value is used
  // internally here. We want to render the page without waiting for the data.
  return {
    community: dapper.getCommunity(communityId),
  };
}

// This can be used to force clientLoader() to be called on hard load e.g. when
// we want to retry data fetch with user session that's only available on the
// client. If loader() is not defined, this is implicit.
// clientLoader.hydrate = true;

export default function Community() {
  // Community is data object if returned by loader(),
  // or a Promise if returned by clientLoader().
  const { community } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <>
      <h1>Thunderstore mod repository</h1>

      {/* Limit Suspense to parts that use the awaited data (if sensible) */}
      <Suspense fallback={<SkeletonBox />}>
        <Await resolve={community}>
          {(resolvedCommunity) => <p>List of {resolvedCommunity.name} mods:</p>}
        </Await>
      </Suspense>
    </>
  );
}
```

## TODO

- Use `RouteErrorBoundary` in route components
- Consistently use `isApiError` instead of `instanceof ApiError`, as the latter doesn't work well with errors thrown by loaders
- ~~Add "retry buttons"~~ — done via `FetchErrorState` (see "Granular, in-place errors" above); `RouteErrorBoundary` still reloads on its own for route-level errors
- ~~Consider granular, non-route component-level error boundaries~~ — addressed by the deferred-fetch + `FetchErrorState` pattern (TS-3397). These are not React error boundaries (which only catch render-time errors); they handle rejected loader/`<Await>` promises in place. Remaining surfaces to migrate to this pattern as they come up: per-region fetches on the package, dependants and team pages.
