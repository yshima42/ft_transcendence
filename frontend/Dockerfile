# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim

# アプリケーションディレクトリを作成する
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
# COPY package.json yarn.lock ./

# RUN yarn install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
# COPY . .

EXPOSE 5173
CMD [ "yarn", "dev" ]
