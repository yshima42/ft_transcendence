#!/bin/bash

set -eux
# yarn prisma migrate deploy
yarn prisma migrate dev --name init
yarn prisma db seed
yarn start:dev
