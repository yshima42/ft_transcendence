# イメージを作成するための基礎となるイメージを指定
FROM node:19-alpine3.15

# コンテナ上で実行する作業をするためのディレクトリを作成
RUN mkdir -p /app

# 作業ディレクトリを指定
WORKDIR /app

RUN apk update \
  && apk add --no-cache chromium

# ホストの環境をコンテナにコピー
COPY . .
RUN yarn install

# ポートを指定
EXPOSE 3000

# # コンテナを起動した際に実行されるコマンド
CMD ["yarn", "start:dev"]
