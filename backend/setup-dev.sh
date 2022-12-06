#!/bin/bash

set -eux

BOLD='\033[1m'
GREEN="${BOLD}\033[32m"
RED="${BOLD}\033[31m"
RESET='\033[0m'

# backend
echo -e "${GREEN}Executing backend setup...${RESET}"
# .envファイルがない場合は警告して終了
if [ ! -f .env ]; then
  echo -e "${RED}No .env file ｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡${RESET}"
  exit 1
fi
rm -rf "prisma/migrations"
yarn install
yarn prisma generate # prismaの型定義を生成
expect -c "
  set timeout 1
  spawn yarn prisma migrate dev --name init
  expect \"Do you want to continue? All data will be lost.\"
  send \"y\r\"
  expect eof
"
yarn prisma db seed
