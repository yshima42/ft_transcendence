# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY prisma .

RUN yarn install

COPY . .

# reactQueryDevtoolsを本番環境で表示させないため
# FROMの下につけたいが、yarn installでdependenciesしかインストールされなくなるのでここに書く
ENV NODE_ENV production

EXPOSE 5173
CMD [ "yarn", "dev" ]
