#!/bin/bash

yarn --cwd backend migrate:reset -f
yarn --cwd frontend start:dev &
yarn --cwd backend start:dev
