This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Troubleshooting

### `TypeError: Only absolute URLs are supported` while building the app

Build command requires ENV variable `NEXT_PUBLIC_API_URL`. It can be set via
[Next.js's built-in env file system](https://nextjs.org/docs/basic-features/environment-variables),
or manually when running build command, e.g:

`NEXT_PUBLIC_API_URL=https://api.servers.thunderstore.dev yarn workspace @thunderstore/sertra build`

or when building a Docker image:

`NEXT_PUBLIC_API_URL=https://api.servers.thunderstore.dev docker build -f apps/sertra/Dockerfile --build-arg NEXT_PUBLIC_API_URL .`
