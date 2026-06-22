# @thunderstore/icons

The single place the monorepo gets FontAwesome icons. Import every icon from here
instead of directly from `@fortawesome/*`:

```ts
import { faPlus, faLips } from "@thunderstore/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

<FontAwesomeIcon icon={faLips} />;
```

## Why

FontAwesome **Pro** icons need a paid token to install. Routing all icon imports
through this package makes that token **optional**: contributors without it still
get a working app, with Pro icons replaced by free-set placeholders. Maintainers
(and CI) who have the token get the real Pro icons, unchanged.

It also means apps and packages no longer depend on `@fortawesome/*` icon-data
packages directly — only on `@thunderstore/icons`. New apps get the same behaviour
for free with a single dependency and no bundler configuration.

## How it works

- The **free** solid + brand sets are re-exported wholesale, so any free icon is
  available with no extra wiring.
- The **Pro** icons the repo uses are enumerated in [`icons.manifest.json`](./icons.manifest.json).
- On `pnpm install`, the repo-root `postinstall` runs [`scripts/generate-icons.mjs`](./scripts/generate-icons.mjs),
  which writes `src/_generated/active.ts` (git-ignored) in one of two modes:
  - **`pro`** — the Pro packages resolve (installed with a token) → re-export the
    real Pro icons.
  - **`placeholder`** — they don't → alias each Pro icon to a free-set stand-in
    (e.g. `faFilterList` → `faFilter`), falling back to `faQuestion`.

Set `FONTAWESOME_PRO=0` to force placeholder mode even when Pro is installed
(useful for verifying the contributor experience).

## Adding a new Pro icon

1. Add its name to `proSolid` / `proLight` in `icons.manifest.json`.
2. Add a `substitutes` entry mapping it to one or more free-solid stand-ins.
3. Run `pnpm --filter @thunderstore/icons run generate` (or just `pnpm install`).

The placeholder-mode typecheck in CI fails if anything imports a name from this
package that has no Pro entry and no free-set icon, so missing placeholders can't
slip through.

## Scripts

- `pnpm run generate` — regenerate `src/_generated/active.ts` for the current env.
- `pnpm run build` / `pnpm run dev` — type build / watch (via `tsc`).
