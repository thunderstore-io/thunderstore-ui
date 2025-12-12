# @thunderstore/dapper-fake

A mock implementation of the Dapper data provider interface. It generates random data using `@faker-js/faker` to simulate API responses.

## Purpose

-   **Development**: Allows working on the frontend without a running backend.
-   **Testing**: Provides consistent or randomized data for UI tests.
-   **Prototyping**: Quickly mock up new features before the backend API is ready.

## Usage

This package implements the interfaces defined in `@thunderstore/dapper`. It can be swapped in for `@thunderstore/dapper-ts` in the application configuration.

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
