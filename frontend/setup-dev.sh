#!/bin/bash

set -eux

BOLD='\033[1m'
GREEN="${BOLD}\033[32m"
RED="${BOLD}\033[31m"
RESET='\033[0m'

# frontend
echo -e "${GREEN}Executing frontend setup...${RESET}"
if [ ! -f .env ]; then
  echo -e "${RED}No .env file ｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡${RESET}"
  exit 1
fi
yarn install
yarn prisma db pull
yarn prisma generate
