# Image already pulled on runners
FROM node:24.9.0-alpine
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
CMD ["node", "/src/dist/main.js"]
