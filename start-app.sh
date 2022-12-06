#!/bin/bash

set -xeu

yarn --cwd frontend start:dev &
yarn --cwd backend start:dev
