# For running @thunderstore/cyberstorm-remix in Docker container.
FROM node:24.1.0-alpine3.21
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock babel.config.js eslint.config.mjs .eslintignore .yarnrc .prettierrc .prettierignore .stylelintrc ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY apps/cyberstorm-remix ./apps/cyberstorm-remix
RUN chown node:node -R /app

USER node
RUN --mount=type=secret,id=npmrc,target=/home/node/.npmrc,uid=1000 yarn install --frozen-lockfile
ENV NODE_ENV production
RUN yarn workspace @thunderstore/cyberstorm-remix build

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "yarn workspace @thunderstore/cyberstorm-remix start"]
