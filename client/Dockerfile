FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
    && pnpm config set enable-pre-post-scripts true \
    && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]
