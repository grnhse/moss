#!/usr/bin/env bash
set -e # halt script on error

# remove unecessary solano files
git add .
git stash

bundle exec jekyll build
bundle exec htmlproof ./_site --href-ignore /tech.greenhouse.io/,/www.linkedin.com/
