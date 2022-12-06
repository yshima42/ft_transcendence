#!/bin/bash

set -eux

BOLD='\033[1m'
GREEN="${BOLD}\033[32m"
RED="${BOLD}\033[31m"
RESET='\033[0m'

# docker 再起動
echo -e "${GREEN}Restarting docker...${RESET}"
# backend/docker-compose.yml
docker-compose down
docker-compose up -d

# backend
echo -e "${GREEN}Executing backend setup...${RESET}"
# .envファイルがない場合は警告して終了
if [ ! -f .env ]; then
  echo -e "${RED}No .env file ｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡${RESET}"
  exit 1
fi
yarn install
yarn prisma generate # prismaの型定義を生成
yarn prisma migrate dev --name init
yarn prisma db seed
