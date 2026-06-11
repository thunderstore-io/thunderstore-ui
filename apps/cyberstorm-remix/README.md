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
