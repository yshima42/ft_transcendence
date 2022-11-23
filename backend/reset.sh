#!/bin/bash

# docker-compose down
# docker-compose up -d
# sleep 2
# yarn prisma migrate dev
# yarn prisma generate
# yarn prisma db seed
yarn prisma migrate reset --skip-generate --skip-seed
yarn start:dev
