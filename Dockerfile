# For running @thunderstore/nextjs in Docker container.
FROM node:16-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock babel.config.js ./
COPY apps/nextjs ./apps/nextjs
COPY packages ./packages

RUN yarn install --frozen-lockfile
# Build packages/hooks & packages/components with preconstruct
RUN yarn build
RUN yarn workspace @thunderstore/nextjs run build

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
USER node

CMD ["yarn", "workspace", "@thunderstore/nextjs", "start"]
