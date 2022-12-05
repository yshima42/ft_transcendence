#!/bin/bash

yarn --cwd backend migrate:reset -f
yarn --cwd backend start:dev &
yarn --cwd frontend start:dev
