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

The Thunderstore dev stack has two halves that run together:

- the **backend** ([Thunderstore](https://github.com/thunderstore-io/Thunderstore)) —
  Django, Postgres, storage, and an **nginx** reverse proxy — runs in **Docker**;
- the **frontend** (this repo) — the `cyberstorm-remix` dev server — runs **natively**
  on your machine.

nginx listens on port 80 and is the single entry point: it serves the API and proxies
app routes to the native frontend dev server, so the browser and server-side rendering
share one origin (`http://thunderstore.localhost`). You therefore need **both** repos
running to see the full site.

The steps below take you from nothing to a working stack. They assume Windows paths in a
couple of places (the original target); the equivalents for macOS/Linux are noted inline.

### 1. Install the prerequisites

Install these once. Versions are pinned by the repo, so match them:

| Tool                                                  | Version                       | How                                             |
| :---------------------------------------------------- | :---------------------------- | :---------------------------------------------- |
| [Git](https://git-scm.com/downloads)                  | any recent                    | OS installer                                    |
| [Docker Desktop](https://docs.docker.com/get-docker/) | any recent (with Compose)     | OS installer; start it before the backend steps |
| [Node.js](https://nodejs.org)                         | `^24.16.0` (any 24.x ≥ 24.16) | via a version manager — see below               |
| [pnpm](https://pnpm.io)                               | `11.5.3`                      | via Corepack — see below                        |

**Node, via [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or
[nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows):**

```bash
# Windows (nvm-windows) — needs the exact version:
nvm install 24.16.0
nvm use 24.16.0

# macOS / Linux (nvm) — latest 24.x is fine:
nvm install 24
nvm use 24
```

**pnpm, via Corepack** (ships with Node, so no separate install). Run this once; inside
the repo it then auto-selects the pinned `11.5.3` from `package.json`'s `packageManager`
field:

```bash
corepack enable
```

If Corepack is unavailable, install pnpm globally instead: `npm install -g pnpm@11.5.3`.

### 2. Clone both repos side by side

Keep them as siblings in one folder:

```bash
mkdir thunderstore && cd thunderstore
git clone https://github.com/thunderstore-io/Thunderstore
git clone https://github.com/thunderstore-io/thunderstore-ui
```

### 3. Add the dev hostnames to your hosts file

`*.localhost` does not resolve automatically on Windows. Edit
`C:\Windows\System32\drivers\etc\hosts` (as Administrator) and add:

```text
127.0.0.1 thunderstore.localhost
127.0.0.1 old.thunderstore.localhost
127.0.0.1 auth.thunderstore.localhost
```

On macOS/Linux this is usually unnecessary (`*.localhost` resolves to `127.0.0.1`); add the
same lines to `/etc/hosts` only if your resolver doesn't.

### 4. Start the backend (Docker)

From the `Thunderstore` repo, create its env file and bring the stack up:

```bash
cd Thunderstore
cp .env.template .env
docker compose up -d
```

The first start runs database migrations — give it a minute. Follow progress with
`docker compose logs -f`.

### 5. Seed the backend database

This populates test data, wires up the `*.localhost` site mappings, and creates a default
`admin` / `admin` superuser:

```bash
docker compose exec django python manage.py setup_dev_env
```

At this point the backend alone already serves:

- **Legacy site** — <http://old.thunderstore.localhost>
- **Admin panel** — <http://thunderstore.localhost/djangoadmin/> (`admin` / `admin`)

Visiting <http://thunderstore.localhost> now shows a "frontend dev server not running"
page (HTTP 503) until you finish the next steps.

### 6. Install the frontend dependencies

In a separate terminal, from this repo:

```bash
cd thunderstore-ui
pnpm install
```

No FontAwesome token is required — see [FontAwesome Pro](#fontawesome-pro-optional) below.

### 7. Start the frontend dev server

```bash
pnpm dev
```

`pnpm dev` runs the React Router dev server (on `:3000`) together with the build watchers
for the UI packages consumed as `dist` (`@thunderstore/cyberstorm`,
`@thunderstore/cyberstorm-theme`, `@thunderstore/ts-uploader`), so changes to the app
**and** those packages are picked up automatically.

### 8. Open the app

| URL                                          | What                                                        |
| :------------------------------------------- | :---------------------------------------------------------- |
| <http://thunderstore.localhost>              | The main site (frontend + API through nginx) — **use this** |
| <http://localhost:3000>                      | The dev server directly (bypasses nginx)                    |
| <http://old.thunderstore.localhost>          | The legacy Django site                                      |
| <http://thunderstore.localhost/djangoadmin/> | Django admin (`admin` / `admin`)                            |

That's the full loop. On later sessions you only need to start Docker, run
`docker compose up -d` in `Thunderstore`, and `pnpm dev` here.

### FontAwesome Pro (optional)

Icons are imported through the [`@thunderstore/icons`](packages/icons/README.md) package.
**Without a FontAwesome Pro token the project installs, builds, and runs normally** — the
Pro icons are replaced by free-set placeholders, so contributors need to do nothing here.

Maintainers who have a Pro token and want the real icons add it to their **own** npm config
before `pnpm install` (not to the committed config). Put it in a user `~/.npmrc`, or in the
git-ignored `build-secrets/.npmrc`:

```text
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=<your-token>
```

Re-run `pnpm install` afterwards to pull the Pro packages and regenerate the icon set in Pro
mode. (`FONTAWESOME_PRO=0` forces placeholder mode even when the Pro packages are installed.)

## Monorepo layout

- **`apps/*`** — runnable applications. The main one is `cyberstorm-remix` (the
  React Router web app); `storybook` hosts the component sandbox.
- **`packages/*`** — reusable libraries, such as `@thunderstore/cyberstorm`
  (components), `@thunderstore/cyberstorm-theme` (design system),
  `@thunderstore/icons` (the FontAwesome icon surface), and the data and uploader
  packages.

Two tools tie it together:

- [pnpm workspaces](https://pnpm.io/workspaces) manage the
  packages (see `pnpm-workspace.yaml` at the repo root) and handle
  dependency installation and deduplication.
- [Preconstruct](https://preconstruct.tools/) builds and links the local packages,
  so you can import them as `@thunderstore/<pkg>` instead of via relative paths.
  Linking runs automatically in the `postinstall` hook (`pnpm exec preconstruct dev`),
  so you normally don't need to run it yourself.

## Storybook

[Storybook](https://storybook.js.org/) is a sandbox for building UI components in
isolation, without starting the whole stack. It also showcases existing components
to encourage reuse.

```bash
pnpm --filter @thunderstore/storybook run storybook
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

`pnpm --filter @thunderstore/storybook exec chromatic` uploads a Storybook manually
(rarely needed, since CI automates it). The Chromatic CLI reads the project
token from the `CHROMATIC_PROJECT_TOKEN` environment variable (or pass
`--project-token`); in CI the token comes from the `CHROMATIC_CYBERSTORM_TOKEN`
Actions secret.

## Testing

Frontend tests run in Vitest browser mode (Playwright). To keep the environment
consistent, use the dedicated test-runner compose file rather than the dev
container.

**Prerequisite:** `./build-secrets/.npmrc` must exist. An **empty** file is fine without
a FontAwesome Pro token (icons fall back to placeholders); add your token to the same file
(see [FontAwesome Pro](#fontawesome-pro-optional)) to test against the real Pro icons.

```bash
pnpm run test:container       # run the tests
pnpm run coverage:container   # run with coverage
```

To type-check the whole monorepo, run `pnpm run tsc`.

## Working in the monorepo

### Adding dependencies

Add a dependency to a specific workspace:

```bash
pnpm --filter @thunderstore/cyberstorm add react-table @types/react-table
```

### Adding a new package

New packages are scaffolded with [plop](https://plopjs.com/documentation/). Run
`pnpm run plop` at the repo root and answer the prompts. The templates live in
[`./plop/package`](./plop/package) and the generator config in
[`./plopfile.mjs`](./plopfile.mjs); update them if package requirements change.

![Plop generation example](./docs/plop.png)

### Using icons

Import every FontAwesome icon from `@thunderstore/icons`, never directly from
`@fortawesome/*-svg-icons`:

```ts
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@thunderstore/icons";
```

Free icons work with no extra steps. To use a new **Pro** icon, add it to
[`packages/icons/icons.manifest.json`](packages/icons/icons.manifest.json) — see that
package's [README](packages/icons/README.md) for how the Pro/placeholder swap works.

## Building for production

`pnpm run build` builds the workspace packages with Preconstruct (assuming `pnpm
install` has already run). To build and serve the app itself:

```bash
pnpm run build
pnpm --filter @thunderstore/cyberstorm-remix run build
pnpm --filter @thunderstore/cyberstorm-remix run start
```

### Docker images

Build configuration for some apps lives in `docker-compose.remix.build.yml`. The build
works without a FontAwesome Pro token (placeholder icons). For the real Pro icons, put your
token in `./build-secrets/.npmrc` first (see [FontAwesome Pro](#fontawesome-pro-optional)).

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

**`thunderstore.localhost` shows "frontend dev server not running" (HTTP 503).** The
backend is up but the native dev server isn't. Run `pnpm dev` in this repo, then reload.

**`*.localhost` doesn't resolve.** On Windows, add the hosts-file entries from
[step 3](#3-add-the-dev-hostnames-to-your-hosts-file). On other systems, add the same
lines to `/etc/hosts` if your resolver doesn't handle `*.localhost`.

**Symlink errors after `pnpm install` on Windows.** Enable Developer Mode in Windows
settings. See
[preconstruct#381](https://github.com/preconstruct/preconstruct/issues/381).

**Wrong pnpm version.** The expected version is pinned in the `packageManager`
field of the root `package.json`. With Corepack enabled (`corepack enable`), the
pinned version is used automatically; otherwise update your global install with
`npm install -g pnpm@11.5.3`.

**Changed icon imports aren't reflected.** A running `pnpm dev` caches the workspace
module graph; after pulling a dependency change (or switching the FontAwesome Pro
token on/off), stop it and re-run `pnpm install && pnpm dev`.
