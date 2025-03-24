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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "./util", "../commonsrc/util", "./firebaseconfig"], function (require, exports, util_1, util_2, firebaseconfig) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Data = void 0;
    firebaseconfig = __importStar(firebaseconfig);
    // A DAO and server connection for the user's application state.
    class Data {
        constructor(listener) {
            this.consented = false; // Set when the server thinks this user has all required agreements
            this.consentCheckTimestamp = 0; // Last time we checked agreements
            this.hasMicrophonePermission = 'maybe'; // Maybe means we won't know until we request.
            // The user's currently assigned tasks, if any
            this.tasks = [];
            this.tasksById = new Map();
            this.listener = listener;
            firebase.auth().onAuthStateChanged(async (user) => await this.handleUserAuth(user));
        }
        // Called when Firebase gets a sign-in
        async handleUserAuth(fbuser) {
            this.fbuser = fbuser;
            await this.checkPermissions();
            if (this.fbuser == null) {
                await this.listener.handleUpdate();
            }
            else {
                // Load whatever we know about the user and then update the UI
                const result = await (0, util_1.postAsJson)('/api/getuser', {});
                const [euser, etasks, isConsented] = result;
                this.consented = isConsented;
                this.consentCheckTimestamp = Date.now();
                if (euser) {
                    this.updateFields(euser, etasks);
                }
                // Poke the app to respond to state changes
                await this.listener.handleUpdate();
            }
        }
        // Fetches the list of applicable consents for this user; only the live version is included.
        async listConsents(language, tags) {
            return await (0, util_1.postAsJson)('/api/listconsents', { language, tags });
        }
        // Fetches the HTML body of a consent
        async loadConsentText(consentId, version) {
            const rsp = await (0, util_1.authenticatedFetch)('/api/getconsenttext', { consentId, version }, 'get');
            return await rsp.text();
        }
        // Creates a new user account. The user must be signed in.
        async enroll(language, tags, agreements, demographics) {
            if (!this.fbuser) {
                throw new Error('Unexpected signup for unauthenticated user');
            }
            const result = await (0, util_1.postAsJson)('/api/signup', { language, tags, agreements, demographics });
            const [euser, etasks, isConsented] = result;
            this.updateFields(euser, etasks);
            this.consented = isConsented;
            this.consentCheckTimestamp = Date.now();
            console.log(`created user: ${JSON.stringify(this.user)}`);
            await this.listener.handleUpdate();
        }
        // Adds the given agreements to the user's consent records
        async updateAgreements(agreements) {
            if (!this.fbuser || !this.user) {
                throw new Error('Unexpected agreement for unauthenticated/unenrolled user');
            }
            const result = await (0, util_1.postAsJson)('/api/updateagreements', { agreements });
            const [euser, isConsented] = result;
            this.user = euser;
            this.consented = isConsented;
            this.consentCheckTimestamp = Date.now();
            await this.listener.handleUpdate();
        }
        // Saves the given audio/transcript pair to the server.
        async saveAudio(task, audioData, mimeType) {
            return await util_1.Spinner.waitFor(async () => {
                const now = new Date();
                const args = {
                    task: JSON.stringify(task),
                    localdate: (0, util_2.formatDateCode)(now),
                    tzo: now.getTimezoneOffset(),
                    mimeType
                };
                const rsp = await (0, util_1.authenticatedFetch)('/api/uploadaudio', args, 'post', audioData);
                const [euser, etask, erec] = await rsp.json();
                await this.updateTask(euser, etask);
                return erec;
            });
        }
        // Deletes a recording and updates the user.
        async deleteAudio(task) {
            await util_1.Spinner.waitFor(async () => {
                const taskId = task.id;
                const rsp = await (0, util_1.authenticatedFetch)('/api/deleteaudio', { taskId }, 'post');
                const [euser, etask] = await rsp.json();
                await this.updateTask(euser, etask);
            });
        }
        // Returns true if the user has a previously stored eligibilty marker, or if they have consented.
        loadEligibility() {
            if (this.user) {
                return true; // they have a user so they must have already gotten past the signup flow
            }
            const d = localStorage.getItem('eligible');
            return !!d && d === 'yes';
        }
        // Stores the user's eligibility response so they can skip the signup form next time
        saveEligibility() {
            localStorage.setItem('eligible', 'yes');
        }
        // Stores demographics locally, for later submission when we enroll the person
        saveDemographics(d) {
            localStorage.setItem('demographics', JSON.stringify(d));
        }
        // Retrieves any previously stored demographics, or returns a new blank one.
        loadDemographics() {
            const d = localStorage.getItem('demographics');
            if (d) {
                return JSON.parse(d);
            }
            else {
                return {};
            }
        }
        // Stores the user's microphone choice on this browser, or '' for default device.
        saveMicrophoneChoice(deviceId) {
            localStorage.setItem('microphone', deviceId);
        }
        // Returns the selected microphone, or '' if the default should be used.
        loadMicrophoneChoice() {
            const deviceId = localStorage.getItem('microphone');
            return deviceId ? deviceId : '';
        }
        // Stores tag and lang markers in local storage, so we can fill in defaults during enrollment.
        saveEnrollTags(lang, tags) {
            if (lang) {
                localStorage.setItem('lang', lang);
            }
            localStorage.setItem('tags', JSON.stringify(tags));
        }
        // Restores any enrollment tags that the user had previously, and treats these as defaults.
        loadEnrollTags() {
            if (this.user) {
                // Once the user is enrolled, we prefer their persistent tags over the local storage cache
                return [this.user.language, this.user.tags];
            }
            const lang = localStorage.getItem('lang');
            const tagsJson = localStorage.getItem('tags');
            return [
                lang ? lang : firebaseconfig.DEFAULT_SIGNUP_LANGUAGE,
                tagsJson ? JSON.parse(tagsJson) : []
            ];
        }
        // Returns true if all required fields in the demographics struct are complete.
        isCompletedDemographics() {
            let d;
            if (this.user && this.user.demographics) {
                d = this.user.demographics;
            }
            else {
                d = this.loadDemographics();
            }
            return (!!d.country &&
                (d.country !== 'USA' || !!d.state) &&
                (d.hasHelper != undefined) &&
                (!d.hasHelper || !!d.helperEmail) &&
                !!d.consentStorage &&
                !!d.consentInitials &&
                !!d.acceptTos);
        }
        // Acquires updated data from the server's responses
        updateFields(user, tasks) {
            this.user = user;
            this.tasks = tasks;
            this.tasksById.clear();
            for (const task of tasks) {
                this.tasksById.set(task.id, task);
            }
            if (user) {
                (0, util_1.setDisplayLanguage)(user.language);
            }
        }
        // Same as above, but processes a change to only one task
        async updateTask(user, task) {
            this.user = user;
            this.tasksById.set(task.id, task); // Replace only one task
            this.tasks = [...this.tasksById.values()]; // Rebuild the array
            await this.listener.handleUpdate();
        }
        // Queries for the microphone permission and updates status bits.
        async checkPermissions() {
            try {
                const p = await navigator.permissions.query({ name: 'microphone' });
                if (!p || !p.state || `${p.state}` === 'ask' || `${p.state}` === 'prompt') {
                    this.hasMicrophonePermission = 'maybe';
                }
                else if (p.state === 'granted') {
                    this.hasMicrophonePermission = 'yes';
                }
                else if (p.state === 'denied') {
                    this.hasMicrophonePermission = 'no';
                }
            }
            catch (e) {
                // The Permission API for microphone is unsupported on Firefox, so we just have to try it.
                console.log(`Failed to query microphone permission, assuming we'll have to ask.`);
                console.error(e);
                this.hasMicrophonePermission = 'maybe';
            }
        }
    }
    exports.Data = Data;
});
//# sourceMappingURL=data.js.map