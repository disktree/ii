#!/bin/bash

set -a
source .env

curl -H "Authorization: ApeKey $MONKEYTYPE_KEY" \
     -H "Accept: application/json" \
     "https://api.monkeytype.com/results" > data/monkeytype.json
