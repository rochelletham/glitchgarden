#!/usr/bin/env sh

set -e

git checkout dev 

npm run build

cd dist

git init
git checkout -b main
git add -A
git commit -m "New Deployment from dev"
git push -f git@github.com:rochelletham/glitchgarden.git main:gh-pages

cd -