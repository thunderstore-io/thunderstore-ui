# @thunderstore/beta-switch

A utility script that injects a "Switch to Beta/Legacy" button into the DOM. This allows users to toggle between the legacy Thunderstore frontend (Django) and the new Nimbus frontend (Remix).

## Functionality

-   Detects the current environment (Production, QA, or Dev).
-   Maps URLs between the legacy and beta sites.
-   Injects a button into the DOM element with ID `#nimbusBeta` (desktop) and `#nimbusBetaMobile` (mobile).
-   Handles redirects, including special cases for specific pages.

## Usage

This package is intended to be imported and run on the client-side. It automatically executes when the DOM is ready.

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
