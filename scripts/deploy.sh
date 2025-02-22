#!/bin/bash
set -a
source .env
rsync -avz public/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"
