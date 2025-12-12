#!/bin/sh
set -e

# Sync Nginx configs
mkdir -p /etc/nginx/user-conf
cp /workspace/tools/nginx/*.conf /etc/nginx/user-conf/ 2>/dev/null || true

# Setup npmrc
if [ -f /run/secrets/npmrc ]; then
  cp /run/secrets/npmrc /home/node/.npmrc
  chown node:node /home/node/.npmrc
fi

# Ensure node_modules exists and is owned by node
if [ ! -d node_modules ]; then
    mkdir -p node_modules
fi
chown node:node node_modules

# Ensure nested node_modules exists and is owned by node
mkdir -p apps/cyberstorm-remix/node_modules
chown node:node apps/cyberstorm-remix/node_modules

# Ensure react-router cache dir is writable by node
mkdir -p apps/cyberstorm-remix/.react-router
chown -R node:node apps/cyberstorm-remix/.react-router

# Install dependencies if missing or if react-router is missing
if [ -z "$(ls -A node_modules)" ] || [ ! -f node_modules/.bin/react-router ]; then
    echo "Installing dependencies..."
    # Fix permissions recursively before install to ensure we can write
    chown -R node:node node_modules
    chown -R node:node apps/cyberstorm-remix/node_modules

    su node -c "yarn install --frozen-lockfile --production=false"
fi

# Map localhost to the django container IP so SSR API calls hit the backend
django_ip=$(getent hosts django | awk '{print $1}')
if [ -n "$django_ip" ]; then
  # Prepend to /etc/hosts to take precedence over the default loopback entry.
  # Overwrite in place instead of mv, as /etc/hosts may be mounted by Docker.
  {
    printf "%s localhost\n" "$django_ip"
    cat /etc/hosts
  } > /tmp/hosts && cat /tmp/hosts > /etc/hosts || printf "%s localhost\n" "$django_ip" >> /etc/hosts

  # Redirect container-local port 80 to the Django service port (8000) so
  # SSR requests to http://localhost hit the backend without altering
  # client-side env values. Use socat to avoid kernel capabilities fiddling.
  if command -v socat >/dev/null 2>&1; then
    socat TCP-LISTEN:80,reuseaddr,fork TCP:${django_ip}:8000 &
  else
    echo "Warning: socat not found; SSR localhost port 80 will not be forwarded to django:8000"
  fi
fi

# Execute the passed command as node
exec su node -c "$*"
