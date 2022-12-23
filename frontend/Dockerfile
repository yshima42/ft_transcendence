# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim

# アプリケーションディレクトリを指定する
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package.json yarn.lock ./

RUN yarn install
# # 本番用のパッケージをインストールする
# RUN yarn install --production=true

# アプリケーションのソースをバンドルする
COPY . .

EXPOSE 5173
CMD [ "yarn", "dev" ]
