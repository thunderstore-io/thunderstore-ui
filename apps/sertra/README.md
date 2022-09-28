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

## Using SVGs

`@svgr` library allows us to import regular SVG files as components. This is
the preferred way to display SVGs.

```typescript
// As a component in .tsx
import Logo from "/public/ts-logo.svg";

// Use fill to adjust color. While passing values as props works, it's
//  preferrable to define all styles in CSS.
<Logo fill="red" width="2rem" height="2rem" />
```

If components are not feasible for some reason, icons can be shown as pseudo
elements:

```css
/* In .css */
h1:before {
  content: "";
  display: block;
  float: left;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.5rem;
  /* Don't use `/public` prefix with URLs */
  /* Using `0 0/100% 100% ` scales the image to fill width/height */
  mask: url(/ts-logo.svg) 0 0/100% 100%;
  background-color: currentColor;
}
```

## Adding meta tags to a page

When possible component in `HeadWrapper.tsx` should be used to add meta tags. This way the meta tag handling is centralized and can be edited easily for the whole site.

If there are tags missing from the `HeadWrapper` please improve it.
