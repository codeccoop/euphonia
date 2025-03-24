#!/bin/bash
# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

cd $(dirname $(dirname $0))

# "prod", "test", or "local"
DEPLOY_ENV=$1

if [ -z "$DEPLOY_ENV" ]; then
  DEPLOY_ENV=local
fi

# Load vars for the desired deployment
if [ -f "deploy/${DEPLOY_ENV}.json" ]; then
  echo "Using deploy/${DEPLOY_ENV}.json for deployment parameters..."
else
  echo "ERROR: cannot deploy to ${DEPLOY_ENV}: missing file: deploy/${DEPLOY_ENV}.json. Create this file from the example."
  exit 1
fi

# Generate template files
node ./deployvars.js gentemplate $DEPLOY_ENV

HOSTINGNAME="$(node ./deployvars.js printvar "$DEPLOY_ENV" __AUDIOTOOL_FIREBASE_HOST__)"

# Ensure dependencies and compile; should NOT upgrade since we have locked versions for everything
npm install
npm run build

# Same thing for Cloud Functions, which are a separate 
cd functions
npm install
npm run build
cd ..

# Deploy
if [ "${DEPLOY_ENV}" == "local" ]; then
  # Launch the local emulators
  ./node_modules/.bin/firebase target:apply hosting "${HOSTINGNAME}" "${HOSTINGNAME}"
  ./node_modules/.bin/firebase serve --host localhost --port 8991
else
  ./node_modules/.bin/firebase target:apply hosting "${HOSTINGNAME}" "${HOSTINGNAME}"
  ./node_modules/.bin/firebase deploy --only "hosting:${HOSTINGNAME},functions:audioapp,firestore:indexes"
fi
