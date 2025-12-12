# @thunderstore/thunderstore-api

The low-level client for the Thunderstore API. It handles HTTP requests, authentication headers, and basic error handling.

## Features

-   **Method Wrappers**: Typed functions for `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
-   **Fetch Abstraction**: Wraps the native `fetch` API with Thunderstore-specific logic.
-   **Error Handling**: Standardized error classes for API failures.

## Usage

This package is primarily used by `@thunderstore/dapper-ts` and `@thunderstore/ts-api-react` to communicate with the backend.

```typescript
import { apiFetch } from "@thunderstore/thunderstore-api";

// ...
```

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
- `yarn run test`: Runs the test suite once
- `yarn run watch`: Runs the test suite & watches files for changes, triggering a rerun

Note that when running scripts from the monorepo's root, you need to use
e.g. `yarn workspace @thunderstore/thunderstore-api run build`.
