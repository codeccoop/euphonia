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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_SIGNUP_LANGUAGE = exports.audiotoolInitializeFirebase = void 0;
    function audiotoolInitializeFirebase() {
        // These magic values will be rewritten by deploy.sh into the firebaseconfig.ts file.
        firebase.initializeApp({
            apiKey: "AIzaSyBuPq1L4vSIMmF133wbAoCSVkaHa8TjrIA",
            authDomain: "collectivat-euphonia.firebaseapp.com",
            databaseURL: "https://collectivat-euphonia.firebaseio.com",
            projectId: "collectivat-euphonia",
            storageBucket: "collectivat-euphonia.firebasestorage.app",
            messagingSenderId: "103075961393752948672"
        });
    }
    exports.audiotoolInitializeFirebase = audiotoolInitializeFirebase;
    exports.DEFAULT_SIGNUP_LANGUAGE = 'en-US';
});
//# sourceMappingURL=firebaseconfig.js.map