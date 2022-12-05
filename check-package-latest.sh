#!/bin/bash

set -u

projects=("backend" "frontend")
rootDir=$(pwd | sed -r "s/\/\.git\/hooks//")

for project in ${projects[@]}; do
  echo "Executing $project setup:dev"
  cd "$rootDir/$project"
  yarn ncu -e2 > /dev/null
  if [ ${?} -eq 1 ]; then
    printf '\033[31m%s\033[m\n' "No Package Latest!!!"
    exit 1
  fi
done

printf '\033[32m%s\033[m\n' 'ALL Package Latest!!!'
exit 0
