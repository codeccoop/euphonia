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
define(["require", "exports", "./firebaseconfig", "./data", "./signupview", "./interestview", "./instructionsview", "./setupview", "./consentview", "./recordingview", "./doneview", "./util"], function (require, exports, firebaseconfig_1, data_1, signupview_1, interestview_1, instructionsview_1, setupview_1, consentview_1, recordingview_1, doneview_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    // Implements all participant UX.
    class App {
        constructor() {
            this.navPath = ''; // which navigation location the user wants; parsed from the hash
            this.navPassive = false; // whether the passive parameter is set in the hash
            // Firebase setup stuff
            (0, firebaseconfig_1.audiotoolInitializeFirebase)();
            this.data = new data_1.Data(this);
            this.parseHash();
            // DOM elements
            this.main = $('#main');
            $(document).eiprop('title', 'PAGE_TITLE');
            this.signupView = new signupview_1.SignupView(this);
            this.interestView = new interestview_1.InterestView(this);
            this.consentView = new consentview_1.ConsentView(this);
            this.instructionsView = new instructionsview_1.InstructionsView(this);
            this.setupView = new setupview_1.SetupView(this);
            this.recordingView = new recordingview_1.RecordingView(this);
            this.doneView = new doneview_1.DoneView(this);
            this.messageBox = this.main.eadd('<div id=messagebox style="opacity: 0;" />');
            // Default spinner view, so we don't draw the GUI until we've seen one update.
            this.waitingDiv = this.main.eadd('<div class=waiting />');
            this.waitingDiv.text('Loading, please wait...');
            this.waitingSpinner = new util_1.Spinner();
            // Events
            $(window).on('hashchange', async (e) => await this.handleHashChange());
            // Capture a global reference to the app so that we can call functions globally
            window['__audiotool_app'] = this;
        }
        // Shows a transient message to the user.
        showMessage(text, opt_level) {
            const level = opt_level ? opt_level : 'info';
            const isHidden = (this.messageBox.text() === '');
            setTimeout(async () => {
                this.messageBox.eitext(text);
                this.messageBox.addClass(level);
                if (isHidden) {
                    await (0, util_1.fadeIn)(this.messageBox);
                }
                await (0, util_1.sleep)(2000);
                await (0, util_1.animateCss)(this.messageBox, level, 'fadeout', 2);
            }, 1);
        }
        clearMessage() {
            this.messageBox.text('');
            this.messageBox.css('opacity', '0');
        }
        // Returns the navigation path from the current browser navbar, or a default otherwise.
        parseHash() {
            const hash = window.location.hash ? decodeURIComponent(window.location.hash) : window.location.hash;
            // Parse the hash, which is in the syntax #/path;key=value;key=value...
            const parts = hash && hash.startsWith('#') ? hash.substring(1).split(';') : [];
            // Parse any parameters we should draw from the hash like languages or tags
            let [navLanguage, navTags] = this.data.loadEnrollTags();
            this.navPassive = false;
            let seenTags = false;
            for (const part of parts) {
                if (part.startsWith('lang=')) {
                    navLanguage = part.substring(5);
                }
                else if (part.startsWith('tag=')) {
                    if (!seenTags) {
                        seenTags = true;
                        navTags = [];
                    }
                    navTags.push(part.substring(4));
                }
                else if (part == 'passive=true') {
                    this.navPassive = true;
                }
            }
            this.data.saveEnrollTags(navLanguage, navTags);
            (0, util_1.setDisplayLanguage)(navLanguage);
            if (parts.length < 1 || !parts[0].startsWith('/')) {
                // There's no info here, choose defaults based on the user's state
                this.chooseBestNav();
            }
            else {
                this.navPath = parts[0];
            }
        }
        // Decides where the user should be based on their current state
        chooseBestNav() {
            this.navPassive = false;
            if (!this.data.fbuser || !this.signupView.eligible) {
                this.navPath = '/enroll'; // They need to sign-in before we can do anything with them
            }
            else if (!this.data.isCompletedDemographics()) {
                this.navPath = '/interest'; // They need to complete the interest form
            }
            else if (!this.data.consented || !this.data.user) {
                this.navPath = '/consent'; // They need to consent, or re-consent, and then create their records.
            }
            else if (this.data.user.numRecordings === 0 && !this.recordingView.seenRecording) {
                this.navPath = '/instructions'; // Show them instructions since they haven't recorded yet.
            }
            else if (this.data.user.numCompletedTasks >= this.data.user.numTasks) {
                this.navPath = '/done'; // Nothing left to do!
            }
            else if (this.data.hasMicrophonePermission != 'yes') {
                // Test or prompt for the microphone permission
                this.navPassive = true;
                this.navPath = '/setup';
            }
            else {
                this.navPath = '/record'; // Ready for recording!
            }
        }
        // Navigates to the given resource.
        async navigateTo(path, passive = false) {
            if (path.startsWith('/enroll')) {
                this.navPath = `/enroll`;
            }
            else if (path.startsWith('/interest')) {
                this.navPath = `/interest`;
            }
            else if (path.startsWith('/consent')) {
                this.navPath = `/consent`;
            }
            else if (path.startsWith('/instructions')) {
                this.navPath = `/instructions`;
            }
            else if (path.startsWith('/setup')) {
                this.navPath = `/setup`;
                this.navPassive = passive;
            }
            else if (path.startsWith('/record')) {
                this.navPath = `/record`;
            }
            else if (path.startsWith('/done')) {
                this.navPath = `/done`;
            }
            else {
                this.chooseBestNav();
            }
            // Changing the hash string triggers onHashChange
            window.location.hash = this.buildHash();
        }
        // Rebuilds the hash string from the last parsed navigation
        buildHash() {
            const [lang, tags] = this.data.loadEnrollTags();
            let result = `#${this.navPath}`;
            if (this.navPassive) {
                result += ';passive=true';
            }
            if (lang) {
                result += `;lang=${lang}`;
            }
            for (const tag of tags) {
                result += `;tag=${tag}`;
            }
            return result;
        }
        // React to any changes to the user's sign-in state or data
        async handleUpdate() {
            // Always drop the spinner once we've seen the first data update.
            this.waitingDiv.hide();
            if (this.waitingSpinner) {
                this.waitingSpinner.remove();
                this.waitingSpinner = undefined;
            }
            // Update the sub-views based on any changes or data
            await this.signupView.handleUpdate();
            await this.interestView.handleUpdate();
            await this.consentView.handleUpdate();
            await this.instructionsView.handleUpdate();
            await this.recordingView.handleUpdate();
            await this.doneView.handleUpdate();
            await this.setupView.handleUpdate();
            // Switch to the requested view, or based on the user's state now
            await this.handleHashChange();
        }
        // Surfaces the view identified by the given string hash path when it changes.
        async handleHashChange() {
            this.parseHash();
            if (this.navPath == '/enroll') {
                await this.showView(this.signupView);
            }
            else if (this.navPath == '/interest') {
                await this.showView(this.interestView);
            }
            else if (this.navPath == '/consent') {
                await this.showView(this.consentView);
            }
            else if (this.navPath == '/instructions') {
                await this.showView(this.instructionsView);
            }
            else if (this.navPath == '/setup') {
                await this.showView(this.setupView);
            }
            else if (this.navPath == '/record') {
                await this.showView(this.recordingView);
            }
            else if (this.navPath == '/done') {
                await this.showView(this.doneView);
            }
            else {
                // On garbage, redirect to the best valid location
                await this.navigateTo('');
            }
        }
        // Shows the given view and hides the rest.
        async showView(view) {
            this.clearMessage();
            await util_1.Spinner.waitFor(async () => {
                await this.signupView.eshow(view === this.signupView);
                await this.interestView.eshow(view === this.interestView);
                await this.consentView.eshow(view === this.consentView);
                await this.instructionsView.eshow(view === this.instructionsView);
                await this.setupView.eshow(view === this.setupView);
                await this.recordingView.eshow(view === this.recordingView);
                await this.doneView.eshow(view === this.doneView);
            });
        }
    }
    exports.App = App;
    // We're using require.js which runs scripts after the dom has loaded, so we can just go.
    window['__audiotool_app'] = new App();
});
//# sourceMappingURL=app.js.map