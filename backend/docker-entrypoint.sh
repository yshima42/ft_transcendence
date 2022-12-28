#!/bin/bash

set -eux

yarn prisma migrate deploy
yarn prisma db seed
yarn start:prod
