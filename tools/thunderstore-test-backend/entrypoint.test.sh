#!/usr/bin/env bash
set -euo pipefail

HOME_DIR="${HOME:-/root}"

# Setup npmrc (auth) if provided
if [ -f /run/secrets/npmrc ]; then
  # Keep tight perms; contains auth tokens.
  mkdir -p "$HOME_DIR"
  install -m 0600 /run/secrets/npmrc "$HOME_DIR/.npmrc"
fi

export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/ms-playwright}"

did_sync="false"

# Sync the repo into the persistent /workspace volume (if /src is mounted).
if [ -d /src ]; then
  echo "Syncing source into /workspace..."
  if ! command -v rsync >/dev/null 2>&1; then
    echo "ERROR: rsync is required but was not found in PATH" >&2
    exit 127
  fi

  rsync_args_default=(
    -a
    --delete
    --exclude=.git
    --exclude=build-secrets
    --exclude=.npmrc
    --exclude=node_modules
    --exclude=.turbo
    --exclude=.cache
    --exclude=apps/cyberstorm-remix/build
    --exclude=apps/cyberstorm-remix/.react-router
  )

  # If you need args that contain spaces, provide one arg per line via RSYNC_ARGS_NL.
  # Otherwise RSYNC_ARGS is supported for backwards compatibility (whitespace-splitting).
  if [ -n "${RSYNC_ARGS_NL:-}" ]; then
    rsync_args=()
    while IFS= read -r line; do
      [ -z "$line" ] && continue
      rsync_args+=("$line")
    done <<< "$RSYNC_ARGS_NL"
  elif [ -n "${RSYNC_ARGS:-}" ]; then
    echo "WARNING: RSYNC_ARGS is split on whitespace; use RSYNC_ARGS_NL for args containing spaces" >&2
    set -f
    IFS=$' \t\n' read -r -a rsync_args <<< "$RSYNC_ARGS"
    set +f
  else
    rsync_args=("${rsync_args_default[@]}")
  fi
  rsync "${rsync_args[@]}" /src/ /workspace/

  did_sync="true"
fi

mkdir -p \
  /workspace/node_modules \
  /workspace/apps/cyberstorm-remix/node_modules \
  /workspace/apps/cyberstorm-remix/.react-router \
  /usr/local/share/.cache/yarn

# Install JS deps if missing
if [ -z "$(ls -A /workspace/node_modules 2>/dev/null || true)" ] || [ ! -x /workspace/node_modules/.bin/vitest ]; then
  echo "Installing dependencies..."
  if ! command -v yarn >/dev/null 2>&1; then
    echo "ERROR: yarn is required but was not found in PATH" >&2
    exit 127
  fi
  yarn install --frozen-lockfile --production=false
fi

# `preconstruct dev` generates workspace-local link files that rsync will delete on the next sync.
# When node_modules is cached, we still need to recreate those links so Vite can resolve package
# entrypoints (e.g. @thunderstore/dapper-ts, @thunderstore/thunderstore-api).
if [ "$did_sync" = "true" ]; then
  if ! command -v yarn >/dev/null 2>&1; then
    echo "ERROR: yarn is required but was not found in PATH" >&2
    exit 127
  fi
  echo "Refreshing workspace links (postinstall)..."
  yarn run -s postinstall
fi

if [ "$#" -eq 0 ]; then
  set -- yarn test
fi

exec "$@"
