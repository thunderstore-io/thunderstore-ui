# Cyberstorm Remix (Nimbus)

This is the Remix (React Router v7) application that powers the new Thunderstore
frontend (codenamed Nimbus). It is the **main site**: in local development it is
served at `http://thunderstore.localhost`, with the Django backend serving the
API and other backend paths on the same origin.

## Quick Start

You need both `Thunderstore` (backend) and `thunderstore-ui` (frontend) cloned
side by side, e.g.:

```text
C:\projects\Thunderstore
C:\projects\thunderstore-ui
```

The backend runs in Docker; the frontend runs **natively** with Node (this is
much faster than running it in a container, and SSR + the browser then share a
single API origin).

1. **Start the backend** (from the `Thunderstore` repo):

   ```bash
   cd ../Thunderstore
   docker compose up -d
   docker compose exec django python manage.py setup_dev_env
   ```

2. **Start the frontend** (from this repo's root):

   ```bash
   cd ../thunderstore-ui
   pnpm install
   pnpm dev
   ```

   `pnpm dev` builds the workspace UI packages on first run, then starts their
   watchers together with the Remix dev server (on `:3000`). nginx in the backend
   stack proxies `thunderstore.localhost` to it.

3. **Open the browser**:
   - **Main site (this app)**: <http://thunderstore.localhost>
   - **Legacy Django site**: <http://old.thunderstore.localhost>

> **Hosts file:** `*.localhost` resolves to `127.0.0.1` automatically on most
> systems, but Windows needs explicit entries. Ensure
> `C:\Windows\System32\drivers\etc\hosts` contains:
>
> ```text
> 127.0.0.1 thunderstore.localhost
> 127.0.0.1 old.thunderstore.localhost
> 127.0.0.1 auth.thunderstore.localhost
> ```

## Developing without a local backend

If you are working on the frontend and don't need to change the API, the dev
server can route the backend-owned paths to a deployed Thunderstore instead.

Create `apps/cyberstorm-remix/.env.development.local` (git-ignored):

```bash
# Route the backend-owned paths upstream from the dev server.
DEV_API_PROXY_TARGET=https://thunderstore.io

# Point the app at the dev server itself, which now plays nginx's role.
VITE_SITE_URL=http://localhost:3000
VITE_BETA_SITE_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
VITE_COOKIE_DOMAIN=localhost

# Log in on the upstream site rather than through the proxy (see below).
VITE_AUTH_BASE_URL=https://thunderstore.io
VITE_AUTH_RETURN_URL=http://localhost:3000
```

Then `pnpm dev` and open <http://localhost:3000>. Delete the file to go back to
the local-backend setup; `DEV_API_PROXY_TARGET` is what turns the proxy on, and
without it the dev server behaves exactly as before.

Use `https://thunderstore.dev` as the target instead if you would rather not
point development traffic at production.

### Why a proxy rather than just pointing at the API

The upstream sends no CORS headers, so the browser cannot call it directly from
`http://localhost:3000`. Routing those paths through the dev server keeps every
request same-origin. It is the same split nginx performs in the Docker setup,
moved into the dev server — which is why `VITE_API_URL` points at the dev server
here just as it points at nginx there, and why SSR and the browser both reach the
API the same way.

### Signing in

The OAuth round trip cannot complete against `localhost` — the upstream owns the
callback and sets its session cookie on its own domain. Because the app sends
the session as an `Authorization: Session <id>` header rather than a cookie, you
can borrow an existing one instead:

1. Sign in on the upstream site normally.
2. Copy the value of its `sessionid` cookie from your browser's dev tools.
3. On `http://localhost:3000`, run in the console:

   ```js
   document.cookie = "sessionid=PASTE_VALUE_HERE; path=/";
   ```

4. Reload. The app picks it up and authenticates as you.

> **This is a real credential for a real account.** Anything you do while it is
> set is done as that account against that deployment — including writes. Prefer
> a non-production target for authenticated work, and clear the cookie when you
> are done.

Anonymous browsing needs none of this: most read endpoints are unauthenticated,
so package, community and listing pages work as soon as the proxy is on.

## How it fits together

- `pnpm dev` runs the Remix dev server on `0.0.0.0:3000` (see `tools/scripts/dev.mjs`).
- The backend's nginx (`Thunderstore/nginx/conf/default.conf`) routes
  `thunderstore.localhost` to `host.docker.internal:3000` for app routes and to
  Django for `/api`, `/auth`, `/djangoadmin`, `/media`, `/static`, etc.
- Shared local-dev defaults live in the committed `.env.development`, which
  points the app at `http://thunderstore.localhost` out of the box. Put
  personal values (e.g. real Sentry tokens) in a git-ignored
  `.env.development.local`; it takes precedence.
- Editing the Remix app hot-reloads instantly; editing the `@thunderstore/cyberstorm`,
  `@thunderstore/cyberstorm-theme` or `@thunderstore/ts-uploader` packages rebuilds
  their `dist` (~1-2s) and then hot-reloads.

### WSL2 / container file watching

Native file watching is used by default. Inside WSL2 or a bind-mounted volume,
file events may not propagate; set `VITE_USE_POLLING=true` to fall back to
polling.

Also, when Docker Desktop runs the backend on Windows while `pnpm dev` runs
inside WSL2, nginx's `host.docker.internal` reaches the Windows host — not the
WSL2 VM — so port 3000 needs a port proxy (or WSL2 mirrored networking). See
the **WSL2** note in the Thunderstore repo's README.
