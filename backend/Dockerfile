# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim
# FROM node:slim As builder

# アプリケーションディレクトリを指定する
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package.json yarn.lock ./

RUN yarn install
# # 本番用のパッケージをインストールする
# RUN yarn install --production=true

# アプリケーションのソースをバンドルする
COPY . .

RUN apt-get update -q && apt-get install -qy postgresql-client

EXPOSE 3000
CMD [ "./docker-entrypoint.sh" ]
