# Thunderstore UI

## Monorepo Setup

- [`yarn` workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for
  managing the packages in the monorepo (see `packages` key in base
  `package.json` file)
- [`preconstruct`](https://preconstruct.tools/) tool takes a lot of the pain
  out of managing a monorepo
  - code behaves the same in dev as it will in production
  - packages linked locally via `preconstruct dev` (runs automatically in
    `postinstall` hook) without needing to manually build anything
  - `nextjs` workspace uses `@preconstruct/next` plugin to integrate
