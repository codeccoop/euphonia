/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// These magic values will be rewritten by deploy.js into the firebaseconfig.ts file.

export function audioAppInitializeFirebase(firebase:any) {
  // These magic values will be rewritten by deploy.sh into the firebaseconfig.ts file.
  firebase.initializeApp({
    apiKey: "__AUDIOTOOL_FIREBASE_API_KEY__",
    authDomain: "__AUDIOTOOL_FIREBASE_AUTH_DOMAIN__",
    databaseURL: "__AUDIOTOOL_FIREBASE_DATABASE_URL__",
    projectId: "__AUDIOTOOL_FIREBASE_PROJECT_ID__",
    storageBucket: "__AUDIOTOOL_FIREBASE_STORAGE_BUCKET__",
    appId: "__AUDIOTOOL_FIREBASE_APP_ID__",
  });
}
