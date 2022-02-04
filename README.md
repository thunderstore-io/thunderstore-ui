# Thunderstore UI

Monorepo containing Next.js frontend for [thunderstore.io](https://thunderstore.io)
and reusable UI components.

## Monorepo Setup

- [`yarn` workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) manages
  the packages in the monorepo (see `packages` key in base `package.json` file)
  and handles dependency installation/deduplication.
- [`preconstruct`](https://preconstruct.tools/) automates building and linking
  the packages within the monorepo. Instead of using relative paths, local
  packages can be imported as if they were installed via a package manager.
  - Packages can be linked locally by running `yarn preconstruct dev`, but this
    is handled automatically by `postinstall` hook, so developers don't need to
    worry about it.

```
// first time setup
git clone git@github.com:thunderstore-io/thunderstore-ui.git thunderstore-ui
cd thunderstore-ui
yarn install

// start Next.js dev server
yarn workspace @thunderstore/nextjs dev
```

That's it. Changes done to `apps/nextjs` and `packages/components` should both
be automatically visible at [http://localhost:3000/].

```
// production build, assumes yarn install has already been run
// build packages/* with preconstruct
yarn build

// build and start Next.js prod server
yarn workspace @thunderstore/nextjs build
yarn workspace @thunderstore/nextjs start
```

### Troubleshooting

**After running `yarn build`, all the links disappeared from the page**

**Solution**: This seems to occur only when Next.js dev server has already been
up before the packages were built. Most likely this is a cache issue which
results in a rehydration issue on client-side. Simply running `yarn` or manually
deleting `apps/nextjs/.next` after running `yarn build` should solve the issue.

### Adding dependencies

To add new dependencies to existing packages, simply run something like:

```
yarn workspace @thunderstore/components add react-table @types/react-table
```

### Adding a new package

To add a completely new package, start by creating the following file structure:

```
// packages/greeter/package.json:
{
  "name": "@thunderstore/greeter",
  "version": "1.0.0",
  "description": "Example package"
}

// packages/greeter/src/index.tsx:
import React from "react";

export const Greeter: React.FC = () => <p>Hello, world!</p>;
```

To add some required fields to the new package's `package.json`, run
`yarn preconstruct init` and allow modifying `package.json` when asked.

To install dependencies, if any, run e.g.
`yarn workspace @thunderstore/greeter add react react-dom @types/react`.

To "install" the new package to Next.js app, update the `dependencies` section
in `apps/nextjs/package.json` with `"@thunderstore/greeter": "^1.0.0",`.

Then run `yarn` one more time to let Preconstruct work its magic. After that the
new package should be usable in the Next.js app by simply importing it:

```
import { Greeter } from "@thunderstore/greeter";
```

### About VS Code...

VS Code may have problem detecting installed packages in this monorepo/workspace
setup. Installing
[Monorepo Workspace extension](https://marketplace.visualstudio.com/items?itemName=folke.vscode-monorepo-workspace)
may solve them.

## Storybook

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
provides a sandbox to build UI components in isolation, without having to start
up the whole service stack. Additionally it showcases the existing components,
promoting reusability.

To start Storybook, run `yarn workspace @thunderstore/storybook storybook`.
Storybook can then be accessed at [http://localhost:6006/].

When creating new components for `@thunderstore/components`, add stories for
them by creating files under `apps/storybook/stories/components`. See the
existing files for examples.

To add stories for other packages, first edit the `stories` setting specified
at `apps/storybook/.storybook/main.js` so Storybook is aware of your story
files.

To upgrade Storybook when it informs you about new version being available, run
the given `npx sb@latest upgrade` command in `apps/storybook` directory.

## Docker

The provided `Dockerfile` can be used to run the Next.js production server, e.g:

```
// build image (on project root dir)
docker build -f apps/nextjs/Dockerfile -t ts-ui .

// run container
docker run -d -p 3000:3000 ts-ui
```

Similarly, Storybook can be run inside a container:

```
// build image (on project root dir)
docker build -f apps/storybook/Dockerfile -t ts-ui-storybook .

// run container
docker run -p 6006:80 ts-ui-storybook
```

## pre-commit

[Pre-commit](https://pre-commit.com/) enforces code style practices in this
project. Choose your preferred
[installation method](https://pre-commit.com/#install) and then run `pre-commit
install` to enable Git hook scripts. Pre-commit will now automatically cancel
your commits if any problems are detected, and autofix them. Stage the changed
files to your commit and re-run the commit command.

Pre-commit can be disabled for a single commit with `--no-verify` option, but
note that CI also runs pre-commit and will fail if any problems are encountered
at this stage.
