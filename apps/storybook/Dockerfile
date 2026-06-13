# For running @thunderstore/storybook in Docker container.

# Build Storybook to static files
FROM node:24.16.0-alpine3.23 AS builder
RUN npm install -g pnpm@11.5.3
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml babel.config.js ./
COPY apps/storybook ./apps/storybook
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm --filter @thunderstore/storybook run build-storybook

# Run built static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY apps/storybook/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/storybook/storybook-static .
