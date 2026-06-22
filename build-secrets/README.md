# Build Secrets

This directory exists to house secrets that should not be committed to git but
should be available when building, such as the .npmrc file.

The docker compose configuration should expect any such build-time secrets to
be in this directory.

## FontAwesome Pro (optional)

The project builds and runs **without** a FontAwesome Pro token: icons route through
`@thunderstore/icons`, which falls back to free-set placeholders when the Pro packages
aren't installed (see `packages/icons/README.md`). Open-source contributors need no
token — a plain `pnpm install` works.

To get the real Pro icons, route the `@fortawesome` scope to the Pro registry with your
token. Put it in `build-secrets/.npmrc` (git-ignored) or your user `~/.npmrc` — not in
`pnpm-workspace.yaml`, so the default contributor install stays tokenless:

```
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=<your token>
```

`build-secrets/.npmrc` is mounted into the test/build containers; for native `pnpm dev`
pnpm reads your user `~/.npmrc`. After adding the token, re-run `pnpm install` to pull the
Pro packages and regenerate `@thunderstore/icons` in Pro mode.
