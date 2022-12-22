#!/bin/bash

set -eux
# TODO: dbの起動をいい感じで待つ
sleep 3
# yarn prisma migrate deploy
yarn prisma migrate dev --name init
yarn prisma db seed
yarn start:dev
