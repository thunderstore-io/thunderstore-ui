# Thunderstore UI

[![codecov](https://codecov.io/gh/thunderstore-io/thunderstore-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/thunderstore-io/thunderstore-ui)

The web frontend for [thunderstore.io](https://thunderstore.io) and its reusable UI
packages. The main app, `cyberstorm-remix`, is a
[React Router](https://reactrouter.com/) v7 app. It runs against the
[Thunderstore backend](https://github.com/thunderstore-io/Thunderstore), which
serves the API in local development.

## Contents

- [Getting started](#getting-started)
- [Monorepo layout](#monorepo-layout)
- [Storybook](#storybook)
- [Testing](#testing)
- [Working in the monorepo](#working-in-the-monorepo)
- [Building for production](#building-for-production)
- [Code style](#code-style)
- [Troubleshooting](#troubleshooting)

## Getting started

### Prerequisites

- **Node `24.14.0`** (pinned in `engines`) and **Yarn 1 (Classic)**.
- **Font Awesome registry access.** The UI uses Font Awesome Pro icons, served from
  a private registry, so configure auth before installing (see the
  [Font Awesome docs](https://fontawesome.com/docs/web/setup/packages)):

  ```bash
  npm config set "@fortawesome:registry" https://npm.fontawesome.com/
  npm config set "//npm.fontawesome.com/:_authToken" <your-token>
  ```

### Install and run

```bash
git clone git@github.com:thunderstore-io/thunderstore-ui.git
cd thunderstore-ui
yarn install
yarn dev
```

`yarn dev` starts the React Router dev server (on `:3000`) together with the build
watchers for the UI packages consumed as `dist` (`@thunderstore/cyberstorm`,
`@thunderstore/cyberstorm-theme`, `@thunderstore/ts-uploader`), so changes to the
app **and** those packages are picked up automatically.

The app expects the Thunderstore backend to be running, which serves it at
[http://thunderstore.localhost](http://thunderstore.localhost) (the dev server also
listens directly on [http://localhost:3000](http://localhost:3000)). See
[`apps/cyberstorm-remix/README.md`](apps/cyberstorm-remix/README.md) for the full
backend-plus-frontend setup.

## Monorepo layout

- **`apps/*`** — runnable applications. The main one is `cyberstorm-remix` (the
  React Router web app); `storybook` hosts the component sandbox.
- **`packages/*`** — reusable libraries, such as `@thunderstore/cyberstorm`
  (components), `@thunderstore/cyberstorm-theme` (design system), and the data and
  uploader packages.

Two tools tie it together:

- [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) manage the
  packages (see the `workspaces` key in the root `package.json`) and handle
  dependency installation and deduplication.
- [Preconstruct](https://preconstruct.tools/) builds and links the local packages,
  so you can import them as `@thunderstore/<pkg>` instead of via relative paths.
  Linking runs automatically in the `postinstall` hook (`yarn preconstruct dev`),
  so you normally don't need to run it yourself.

## Storybook

[Storybook](https://storybook.js.org/) is a sandbox for building UI components in
isolation, without starting the whole stack. It also showcases existing components
to encourage reuse.

```bash
yarn workspace @thunderstore/storybook storybook
```

Storybook is then available at [http://localhost:6006](http://localhost:6006).

When adding components to `@thunderstore/cyberstorm`, add stories for them under
[`apps/storybook/src/stories`](apps/storybook/src/stories) — see the existing files
for examples. To upgrade Storybook when it reports a new version, run the suggested
`npx storybook@latest upgrade` command in the `apps/storybook` directory.

### Chromatic

[Chromatic](https://www.chromatic.com/docs/) runs in CI to host Storybook and
detect visual changes to stories. Visual changes must be reviewed before the
related PR can merge:

1. Push your changes as usual. The `chromatic-deployment` job in
   `.github/workflows/test.yml` builds and uploads Storybook to Chromatic. This
   step only fails if the build or upload itself fails — component changes are
   not flagged here.
2. Open a PR as usual.
3. If there were visual changes, GitHub shows a pending check (_"UI Tests Pending —
   N changes must be accepted as baselines"_). Open its **Details** link to review
   and accept or reject the changes in Chromatic. The PR cannot merge until they
   are accepted.

`yarn workspace @thunderstore/storybook chromatic` uploads a Storybook manually
(rarely needed, since CI automates it). The Chromatic CLI reads the project
token from the `CHROMATIC_PROJECT_TOKEN` environment variable (or pass
`--project-token`); in CI the token comes from the `CHROMATIC_CYBERSTORM_TOKEN`
Actions secret.

## Testing

Frontend tests run in Vitest browser mode (Playwright). To keep the environment
consistent, use the dedicated test-runner compose file rather than the dev
container.

**Prerequisite:** `./build-secrets/.npmrc` must exist (the same Font Awesome
registry auth required for Docker builds — see
[Building for production](#building-for-production)).

```bash
yarn test:container       # run the tests
yarn coverage:container   # run with coverage
```

To type-check the whole monorepo, run `yarn tsc`.

## Working in the monorepo

### Adding dependencies

Add a dependency to a specific workspace:

```bash
yarn workspace @thunderstore/cyberstorm add react-table @types/react-table
```

### Adding a new package

New packages are scaffolded with [plop](https://plopjs.com/documentation/). Run
`yarn plop` at the repo root and answer the prompts. The templates live in
[`./plop/package`](./plop/package) and the generator config in
[`./plopfile.mjs`](./plopfile.mjs); update them if package requirements change.

![Plop generation example](./docs/plop.png)



## Building for production

`yarn build` builds the workspace packages with Preconstruct (assuming `yarn
install` has already run). To build and serve the app itself:

```bash
yarn build
yarn workspace @thunderstore/cyberstorm-remix build
yarn workspace @thunderstore/cyberstorm-remix start
```

### Docker images

Build configuration for some apps lives in `docker-compose.remix.build.yml`.
Building requires the Font Awesome private-registry credentials: follow the
[Font Awesome docs](https://fontawesome.com/docs/web/setup/packages) to generate a
`~/.npmrc`, then copy it to `./build-secrets/.npmrc`.

> Build secrets are **not** supported by the `docker-compose` Python package — use
> the built-in `docker compose` subcommand.

```bash
docker compose -f docker-compose.remix.build.yml build
```

## Code style

[pre-commit](https://pre-commit.com/) enforces code style (Prettier, Stylelint, and
ESLint). Install the hooks once with `pre-commit install`; they then run
automatically on commit and will block — and often auto-fix — style issues. Re-stage
the fixed files and commit again. CI runs the same checks, so commits that skip them
(`--no-verify`) will fail there.

## Troubleshooting

**Symlink errors after `yarn install` on Windows.** Enable Developer Mode in Windows
settings. See
[preconstruct#381](https://github.com/preconstruct/preconstruct/issues/381).

**`expected workspace package to exist for X`.** Pin Yarn to a known-good version
with `yarn policies set-version 1.19.0`. See
[yarn#8405](https://github.com/yarnpkg/yarn/issues/8405).
