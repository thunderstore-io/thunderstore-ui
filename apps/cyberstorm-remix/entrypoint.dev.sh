#!/bin/sh
set -e

# Helper to ensure dirs exist and are writable by the node user.
ensure_node_dirs() {
  for dir in "$@"; do
    mkdir -p "$dir"
    chown node:node "$dir"
  done
}

# Sync Nginx configs
mkdir -p /etc/nginx/user-conf
cp /workspace/tools/nginx/*.conf /etc/nginx/user-conf/ 2>/dev/null || true

# Setup npmrc
if [ -f /run/secrets/npmrc ]; then
  # Copy with tight permissions; file contains auth tokens.
  install -m 0600 -o node -g node /run/secrets/npmrc /home/node/.npmrc
fi

ensure_node_dirs \
  node_modules \
  apps/cyberstorm-remix/node_modules \
  apps/cyberstorm-remix/.react-router

# Install dependencies if missing or if react-router is missing
if [ -z "$(ls -A node_modules)" ] || [ ! -f node_modules/.bin/react-router ]; then
    echo "Installing dependencies..."
    # Fix permissions recursively before install to ensure we can write.
    chown -R node:node node_modules apps/cyberstorm-remix/node_modules

    su node -c "yarn install --frozen-lockfile --production=false"
fi

# Map thunderstore.localhost to the backend nginx container IP so SSR API calls hit
# the backend without changing client-side env values.
backend_nginx_ip=$(getent hosts nginx | awk '{print $1}')
if [ -n "$backend_nginx_ip" ]; then
  # Prepend to /etc/hosts so it takes precedence.
  # Make idempotent to avoid duplicate lines on restarts.
  if ! grep -q "^${backend_nginx_ip}[[:space:]][[:space:]]*thunderstore\.localhost\([[:space:]]\|$\)" /etc/hosts 2>/dev/null; then
    tmp_hosts=$(mktemp)
    {
      printf "%s thunderstore.localhost\n" "$backend_nginx_ip"
      # Drop existing thunderstore.localhost mappings so the new mapping is unambiguous.
      # This keeps other host entries (including localhost) intact.
      awk '!($0 ~ /(^|[[:space:]])thunderstore\.localhost([[:space:]]|$)/)' /etc/hosts 2>/dev/null || true
    } > "$tmp_hosts"
    cat "$tmp_hosts" > /etc/hosts || printf "%s thunderstore.localhost\n" "$backend_nginx_ip" >> /etc/hosts
    rm -f "$tmp_hosts"
  fi
fi

# Execute the passed command as node (preserve argument boundaries)
# `su -c` uses the first arg after `--` as $0, so provide a dummy.
exec su node -c 'exec "$@"' -- _ "$@"
