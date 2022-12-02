#!/bin/bash
set -eux

docker-compose down
docker-compose up -d

yarn prisma generate
yarn prisma migrate dev --name init
yarn prisma db seed
yarn prisma studio
