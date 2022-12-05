#!/bin/bash

set -uxe

git fetch origin main
git merge origin/main --no-commit --no-ff
MERGE_STATUS=${?}
git merge --abort
if [ ${MERGE_STATUS} -eq 1 ]; then
  printf '\033[31m%s\033[m\n' 'Conflict!!!'
else
  printf '\033[32m%s\033[m\n' 'No Conflict!!!'
fi
exit ${MERGE_STATUS}
