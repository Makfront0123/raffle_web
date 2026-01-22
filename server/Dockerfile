FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

RUN chmod +x wait-for-it.sh start.sh
RUN pnpm run build

EXPOSE 4000

CMD ["./wait-for-it.sh", "mysql", "./start.sh"]
