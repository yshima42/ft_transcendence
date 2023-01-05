# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY prisma .

RUN yarn install

COPY . .

EXPOSE 5173
CMD [ "yarn", "dev" ]
