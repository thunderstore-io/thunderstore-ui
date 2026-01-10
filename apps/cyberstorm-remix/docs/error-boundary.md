# ErrorBoundaries

## Route level ErrorBoundary

`RouteErrorBoundary` provides a simple default error boundary for "route components", i.e. components that are mapped to a specific URL path in `routes.ts`. In practice they should be used with components that implement `loader` and/or `clientLoader`.

Using `RouteErrorBoundary` is as simple as exporting it from the route component file under the name `ErrorBoundary`, e.g:

```typescript
export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";
```

`RouteErrorBoundary` catches any errors in the loaders and renders an error message instead of the actual component. It handles the rejections of Promises returned from the loaders too, just be sure to use Suspense and Await in the main component.

### TODO

- Use `RouteErrorBoundary` in route components
- Consistently use `isApiError` instead of `instanceof ApiError`, as the latter doesn't work well with errors thrown by loaders
- Add "retry buttons" (e.g. reloading the page on 500 series of errors)
- As `RouteErrorBoundary` is all-or-nothing solution when it comes to rendering, consider if there's a need for more granular non-route component level error boundaries. We might not need or want to use them, as error boundaries are intended more for render time errors, and any errors caused by user interaction should be handled by the component logic itself
  - If it turns out we don't want other error boundaries, consider renaming `RouteErrorBoundary` to just `ErrorBoundary`
