#!/bin/bash

set -eux

BOLD='\033[1m'
GREEN="${BOLD}\033[32m"
RED="${BOLD}\033[31m"
RESET='\033[0m'

# リモートに今のブランチがあるかチェック。あるならpullしてくる
echo -e "${GREEN}Checking remote branch...${RESET}"
git fetch origin $(git rev-parse --abbrev-ref HEAD) && git pull || echo -e "${GREEN}No remote branch${RESET}"

# docker 再起動
echo -e "${GREEN}Restarting docker...${RESET}"
# backend/docker-compose.yml
docker-compose -f backend/docker-compose.yml down
docker-compose -f backend/docker-compose.yml up -d

# backend
echo -e "${GREEN}Executing backend setup...${RESET}"
# .envファイルがない場合は警告して終了
if [ ! -f backend/.env ]; then
  echo -e "${RED}No .env file ｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡${RESET}"
  exit 1
fi
rm -rf "backend/prisma/migrations"
yarn --cwd backend install
yarn --cwd backend prisma generate
yarn --cwd backend prisma migrate dev --name init
yarn --cwd backend prisma db seed

# frontend
echo -e "${GREEN}Executing frontend setup...${RESET}"
if [ ! -f frontend/.env ]; then
  echo -e "${RED}No .env file ｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡${RESET}"
  exit 1
fi
yarn --cwd frontend install
yarn --cwd frontend prisma db pull
yarn --cwd frontend prisma generate
