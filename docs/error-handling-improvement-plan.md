# Error Handling Improvement Plan

This document outlines two core issues with the current error handling strategy and proposes solutions to improve UI stability and user experience.

## 1. Unhandled `clientLoader` Promise Rejections

### Issue
When a server-side rendering (SSR) loader fails, any subsequent promise rejections within `clientLoader` are caught by the top-level route error boundary. This causes the entire page to be replaced by a generic error message, leading to a poor user experience. The caught error is often difficult to parse, resulting in a vague error message.

### Proposed Solution
Implement a "Retry" button within the error boundary that performs a hard navigation to the current page. This will force a full page reload, re-triggering the SSR loader.

### Risks & Considerations
- **Traffic Spikes:** If a failing SSR response is cached, multiple clients will receive the error and then perform a hard reload. This could lead to a sudden increase in server traffic.
- **Further Investigation:** This behavior may indicate a deeper issue. A long-term solution could involve replacing route-level error boundaries with a custom error boundary that wraps each route's output, providing more granular control.

## 2. Lack of Granular Error Boundaries

### Issue
React Router does not provide out-of-the-box support for component or layout-level error boundaries. As a result, an error thrown by a single component can cascade and replace the entire page with an error message. While the `Suspense`/`Await` pattern is effective for handling promise-based errors, it does not cover non-promise-related errors (e.g., a bug in component logic).

### Proposed Solution
Create a reusable `NimbusErrorBoundary` component that can be used to wrap individual components or sections of a layout. This approach offers several advantages:
- **Improved UX:** Prevents a single component failure from crashing the entire page.
- **Better Error Reporting:** Enables more specific and useful error messages for users.
- **Easier Debugging:** Provides better context for developers to identify and fix the root cause of an error.

### Risks & Considerations
- **Boilerplate Code:** This will introduce some boilerplate, as components will need to be explicitly wrapped with `NimbusErrorBoundary`. However, this is a necessary trade-off for achieving granular error handling.
- **React Limitations:** [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) have some limitations, but these generally encourage better component design by promoting smaller, more isolated components.

## Audit Log (2025-11-04)

| Path | Current pattern | Risk | Suggested next step |
| --- | --- | --- | --- |
| apps/cyberstorm-remix/app/c/community.tsx | Nimbus boundary wraps the community header and all loader errors render a retry surface that triggers a full reload. | Low — localized failures retry without collapsing the entire route. | - (2025-11-04) Completed. |
| apps/cyberstorm-remix/app/c/tabs/PackageSearch/PackageSearch.tsx | Await and route errors render Nimbus fallbacks with retry navigation, keeping results scoped to the tab. | Low — promise rejections now recover without wiping the page. | - (2025-11-04) Completed. |
| apps/cyberstorm-remix/app/commonComponents/PackageSearch/PackageSearch.tsx | Component is exported through a Nimbus boundary with a reusable fallback to contain synchronous UI failures. | Low — component-level issues stay isolated and offer retriable UX. | - (2025-11-04) Completed. |
