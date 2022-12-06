FROM node:19-alpine3.15

RUN mkdir -p /app

WORKDIR /app

RUN apk update

COPY . .
RUN yarn install


EXPOSE 5173

CMD ["yarn", "dev"]
