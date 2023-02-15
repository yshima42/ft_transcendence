# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:slim as builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY prisma .

RUN yarn install

COPY . .
RUN yarn build

FROM nginx:1.22

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
