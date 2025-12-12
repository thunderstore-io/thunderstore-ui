# @thunderstore/dapper-ts

The production implementation of the Dapper data provider interface. It fetches real data from the Thunderstore API.

## Features

-   **API Integration**: Connects to the Thunderstore backend via `@thunderstore/thunderstore-api`.
-   **Type Safety**: Implements the strict interfaces defined in `@thunderstore/dapper`.
-   **Validation**: Uses `zod` to validate API responses at runtime.

## Usage

This is the default data provider used in the production application.

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
- `yarn run test`: Runs tests with Vitest
