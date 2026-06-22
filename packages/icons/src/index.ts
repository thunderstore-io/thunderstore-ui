// Public entrypoint for @thunderstore/icons.
//
// Import every FontAwesome icon used in the app from here instead of directly
// from "@fortawesome/*". The active set is produced by scripts/generate-icons.mjs
// (run on `pnpm install`) and re-exports either the real Pro icons, when the Pro
// packages are installed, or free-set placeholders when they are not — so the
// project builds and runs without a FontAwesome Pro token. See README.md.
export * from "./_generated/active";
