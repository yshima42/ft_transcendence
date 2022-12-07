#!/bin/bash

set -eux

BOLD='\033[1m'
GREEN="${BOLD}\033[32m"
RED="${BOLD}\033[31m"
RESET='\033[0m'

# リモートに今のブランチがあるかチェック。あるならpullしてくる
echo -e "${GREEN}Checking remote branch...${RESET}"
git fetch origin $(git rev-parse --abbrev-ref HEAD) && git pull || echo -e "${GREEN}No remote branch${RESET}"

cd backend
bash setup-dev.sh

cd ../frontend
bash setup-dev.sh