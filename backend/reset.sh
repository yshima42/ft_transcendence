#!/bin/bash
set -eux

docker-compose down
docker-compose up -d

rm -rf prisma/migrations/
yarn prisma generate
yarn prisma migrate dev --name init
yarn prisma db seed
yarn prisma studio
