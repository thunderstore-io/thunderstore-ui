# For running @thunderstore/cyberstorm-remix in Docker container.
FROM node:24.16.0-alpine3.23
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@11.5.3

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml babel.config.js eslint.config.mjs .eslintignore .prettierrc .prettierignore .stylelintrc ./
COPY packages ./packages
COPY apps/cyberstorm-remix ./apps/cyberstorm-remix
RUN chown node:node -R /app

USER node
RUN --mount=type=secret,id=npmrc,target=/home/node/.npmrc,uid=1000 pnpm install --frozen-lockfile
ENV NODE_ENV production
RUN pnpm --filter @thunderstore/cyberstorm-theme run build
RUN pnpm --filter @thunderstore/cyberstorm run build
RUN pnpm --filter @thunderstore/ts-uploader run build
RUN pnpm --filter @thunderstore/cyberstorm-remix run build

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "pnpm --filter @thunderstore/cyberstorm-remix run start"]
