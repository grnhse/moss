#!/bin/bash
set -e -o pipefail

export AWS_ACCESS_KEY_ID=$DEPLOY_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$DEPLOY_AWS_SECRET_ACCESS_KEY

UPLOAD_FOLDER=_site
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$DEPLOY" == "true" && "$CURRENT_BRANCH" == "master" && "$TDDIUM_BUILD_STATUS" == "passed" ]]; then
  if ! command -v aws &> /dev/null; then
    echo "Installing aws-cli"
    date

    pip install --install-option="--prefix=$HOME" awscli

    echo "Installation of aws-cli complete"
    date
  fi

  aws s3 cp "$UPLOAD_FOLDER/" "$DEPLOY_BUCKET" --recursive
  aws s3 rm "${DEPLOY_BUCKET}/script" --recursive
  aws s3 rm "${DEPLOY_BUCKET}/solano.yml"
fi


