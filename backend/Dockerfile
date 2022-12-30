# ソースをビルドするステージ
FROM node:slim As builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY prisma .

RUN yarn global add @nestjs/cli
RUN yarn install --production=true

COPY . .
RUN yarn build

# 前のステージから必要なものをコピーするステージ
FROM node:slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/wait-for-postgres.sh ./wait-for-postgres.sh
COPY --from=builder /usr/src/app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder /usr/src/app/.env ./.env

# DBの起動を待つためクライアントが必要
RUN apt-get -q update && apt-get -qy install postgresql-client

EXPOSE 3000
CMD [ "./docker-entrypoint.sh" ]
