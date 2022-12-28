#!/bin/bash

set -eux

yarn prisma generate
yarn prisma migrate deploy
yarn prisma db seed
yarn start:dev
