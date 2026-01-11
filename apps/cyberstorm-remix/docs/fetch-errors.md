# Data Fetching and Error Handling

React Router has two methods for fetching data for "route components", i.e. components that are mapped to a specific URL path in `routes.ts`. To fetch data on server side, `loader()` is used, whereas `clientLoader()` is used on client side.

`cyberstorm-remix` uses mostly DapperTs library for fetching the data inside the loaders. However, there are slight differences in how DapperTs should be used to ensure proper Promise and Error handling.

## SSR `loader()`

- User session is available only on client side, so any API requests are made as an unauthenticated user. Therefore there's no point in implementing `loader()` for a route that requires authentication.
- `loader()` should always `await` the Promise returned from the DapperTs query method.
- `loader()` should throw `Response` objects when data fetching fails to ensure proper error handling.
  - `ssrSafe()` helper should be used to achieve this.

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
import { Suspense } from "react";
import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import { ssrSafe } from "app/commonComponents/ErrorBoundary";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";

// This component is now wrapped in the default error boundary.
export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

// Provides data for server side rendering. Used on "hard load", i.e. when
// entering the page with direct URL. Used also on client side navigation, but
// only if clientLoader() is not defined.
export async function loader({ params }: LoaderFunctionArgs) {
  const { communityId } = params;

  if (!communityId) {
    throw new Response("Community not found", { status: 404 });
  }

  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => ({
    apiHost: publicEnvVariables.VITE_API_URL,
  }));

  // Await data returned from SSR loader().
  // Use ssrSafe for proper error handling.
  return {
    community: await ssrSafe(() => dapper.getCommunity(communityId)),
  };
}

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
- Consider adding a singleton DapperTS instance for SSR loaders that automatically handles ssrSafe for all methods
- Add "retry buttons" (e.g. reloading the page on 500 series of errors)
- As `RouteErrorBoundary` is all-or-nothing solution when it comes to rendering, consider if there's a need for more granular non-route component level error boundaries. We might not need or want to use them, as error boundaries are intended more for render-time errors, and any errors caused by user interaction should be handled by the component logic itself
  - If it turns out we don't want other error boundaries, consider renaming `RouteErrorBoundary` to just `ErrorBoundary`
