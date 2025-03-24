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

 export function audiotoolInitializeFirebase() {
  // These magic values will be rewritten by deploy.sh into the firebaseconfig.ts file.
  firebase.initializeApp({
      apiKey: "TODO",
      authDomain: "yourapp.firebaseapp.com",
      databaseURL: "https://yourapp.firebaseio.com",
      projectId: "yourproject",
      storageBucket: "yourbucket",
      messagingSenderId: "12345"
  });
}

export const DEFAULT_SIGNUP_LANGUAGE = 'en-US';
