# Thunderstore UI

[![codecov](https://codecov.io/gh/thunderstore-io/thunderstore-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/thunderstore-io/thunderstore-ui)

This monorepo contains the frontend applications and shared libraries for [thunderstore.io](https://thunderstore.io).

## 🚀 Key Projects

### [Nimbus (Cyberstorm Remix)](./apps/cyberstorm-remix/README.md)
The next-generation frontend for Thunderstore, built with Remix.
👉 **[Read the Setup Guide](./apps/cyberstorm-remix/README.md)** to get started with the full stack (Frontend + Backend).

### [Storybook](./apps/cyberstorm-storybook)
Component library and design system documentation.
- Run: `yarn workspace @thunderstore/cyberstorm-storybook storybook`
- URL: [http://localhost:6006/](http://localhost:6006/)

## 📦 Packages

Shared libraries located in `packages/`:

### Core UI
- **[`cyberstorm`](./packages/cyberstorm)**: Core React components and design system.
- **[`cyberstorm-forms`](./packages/cyberstorm-forms)**: Form components for Cyberstorm.
- **[`cyberstorm-theme`](./packages/cyberstorm-theme)**: Theme definitions and utilities.

### Data & API
- **[`dapper`](./packages/dapper)**: Data Provider interfaces and types (React Context).
- **[`dapper-ts`](./packages/dapper-ts)**: Production implementation of Dapper using the Thunderstore API.
- **[`dapper-fake`](./packages/dapper-fake)**: Fake implementation of Dapper for testing and development.
- **[`thunderstore-api`](./packages/thunderstore-api)**: Low-level Thunderstore API client.
- **[`ts-api-react`](./packages/ts-api-react)**: React hooks and integration for the API.
- **[`ts-api-react-actions`](./packages/ts-api-react-actions)**: React actions logic for the API.
- **[`ts-api-react-forms`](./packages/ts-api-react-forms)**: React forms logic for the API.

### Utilities
- **[`beta-switch`](./packages/beta-switch)**: Helper for switching between projects on the same domain.
- **[`graph-system`](./packages/graph-system)**: Graph execution system (Nodes/Edges).
- **[`react-dnd`](./packages/react-dnd)**: React drag & drop hooks.
- **[`ts-uploader`](./packages/ts-uploader)**: File upload logic.
- **[`ts-uploader-react`](./packages/ts-uploader-react)**: React components for file uploads.
- **[`typed-event-emitter`](./packages/typed-event-emitter)**: Strongly typed event emitter.
- **[`use-promise`](./packages/use-promise)**: React hook for resolving promises with Suspense support.

## 🛠️ Monorepo Tooling

This project uses:
- **[Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)**: Dependency management.
- **[Preconstruct](https://preconstruct.tools/)**: Links packages locally so changes are reflected immediately without rebuilding.
- **[Plop](https://plopjs.com/)**: Scaffolding for new packages (`yarn run plop`).

### Common Commands

| Command | Description |
| :--- | :--- |
| `yarn install` | Install dependencies for all packages. |
| `yarn build` | Build all packages using Preconstruct. |
| `yarn workspace <name> <cmd>` | Run a command in a specific package. |

## 🤝 Contributing

### Pre-commit Hooks
We use [pre-commit](https://pre-commit.com/) to enforce code style.
1. Install pre-commit: [Installation Guide](https://pre-commit.com/#install)
2. Enable hooks: `pre-commit install`

### Visual Testing (Chromatic)
Pull requests automatically run visual regression tests via [Chromatic](https://www.chromatic.com/). You may need to accept baseline changes in the Chromatic UI before merging.

### VS Code
Recommended extensions:
- [Monorepo Workspace](https://marketplace.visualstudio.com/items?itemName=folke.vscode-monorepo-workspace) (helps with package detection)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
