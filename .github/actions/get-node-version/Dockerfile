# Image already pulled on runners
FROM node:24.16.0-alpine
RUN npm install -g pnpm@11.5.3
WORKDIR /src
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
CMD ["node", "/src/dist/main.js"]
