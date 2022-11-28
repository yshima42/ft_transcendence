#!/bin/bash

set -exu

projects=("backend" "frontend")
rootDir=$(pwd | sed -r "s/\/\.git\/hooks//")

for project in ${projects[@]}; do
  echo "Executing $project setup:dev"
  cd "$rootDir/$project"
  yarn setup:dev 2>/dev/null
done
