# For running @thunderstore/sertra in Docker container.
FROM node:18-alpine3.17
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock babel.config.js .eslintrc.json .eslintignore ./
COPY apps/sertra ./apps/sertra
RUN chown node:node -R /app

USER node
RUN yarn install --frozen-lockfile
RUN yarn workspace @thunderstore/sertra run build

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD ["yarn", "workspace", "@thunderstore/sertra", "start"]
