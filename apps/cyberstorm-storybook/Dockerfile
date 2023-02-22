# For running @thunderstore/cyberstorm-storybook in Docker container.

# Build Storybook to static files
FROM node:18-alpine3.17 AS builder
WORKDIR /app
COPY package.json yarn.lock babel.config.js ./
COPY apps/cyberstorm-storybook ./apps/cyberstorm-storybook
COPY packages ./packages
RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn workspace @thunderstore/cyberstorm-storybook run build-storybook

# Run built static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY apps/cyberstorm-storybook/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/cyberstorm-storybook/storybook-static .
