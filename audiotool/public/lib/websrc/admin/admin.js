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
define(["require", "exports", "../firebaseconfig", "../util", "./tasksets", "./consents", "./users", "./admindata"], function (require, exports, firebaseconfig_1, util_1, tasksets_1, consents_1, users_1, admindata_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdminView = void 0;
    class AdminView {
        constructor() {
            // Firebase setup stuff
            (0, firebaseconfig_1.audiotoolInitializeFirebase)();
            this.data = new admindata_1.AdminData(this);
            // DOM elements
            this.main = $('#main');
            this.login = this.buildLogin();
            this.appDiv = this.main.eadd('<div id=adminapp />');
            this.navbar = this.appDiv.eadd('<div class=navbar />');
            this.usersButton = this.navbar.eadd('<a href="#/users">Users</a>');
            this.tasksetsButton = this.navbar.eadd('<a href="#/tasksets">TaskSets</a>');
            this.consentsButton = this.navbar.eadd('<a href="#/consents">Consents</a>');
            this.appDiv.hide(); // will show up after login
            // Events
            $(window).on('hashchange', async (e) => await this.navigateTo(this.parseHash()));
        }
        // Loads all data into the GUI and go to the desired deep link
        async start() {
            await util_1.Spinner.waitFor(async () => {
                await this.data.update();
                await this.navigateTo(this.parseHash());
            });
        }
        // Returns the current view
        getNav() {
            if (this.tasksets) {
                return this.tasksets.getNav();
            }
            else if (this.users) {
                return this.users.getNav();
            }
            else if (this.consents) {
                return this.consents.getNav();
            }
            else {
                return '';
            }
        }
        // Sets the navigation URL
        setNav(path) {
            window.location.hash = `#${path}`;
        }
        // Returns the navigation path from the current browser navbar, or a default otherwise.
        parseHash() {
            const hash = window.location.hash;
            if (!hash || !hash.startsWith('#')) {
                return '/users'; // Default to the user view
            }
            else {
                return decodeURIComponent(hash.substring(1));
            }
        }
        // Navigates to the given resource, or to the user view if not specified.
        async navigateTo(path) {
            if (path === this.getNav()) {
                return; // Already there
            }
            if (path === '/users') {
                this.startUserView();
            }
            else if (path === '/tasksets') {
                this.startTaskSetsView();
            }
            else if (path == '/consents') {
                this.startConsentsView();
            }
            else if (path.startsWith('/user/')) {
                this.startUserView();
                await this.users.startUserDetail(path.substring('/user/'.length));
            }
            else if (path.startsWith('/taskset/')) {
                this.startTaskSetsView();
                await this.tasksets.startTaskSetDetail(path.substring('/taskset/'.length));
            }
            else if (path.startsWith('/consent/')) {
                this.startConsentsView();
                await this.consents.startConsentDetail(path.substring('/consent/'.length));
            }
        }
        buildLogin() {
            const div = this.main.eadd('<div class=login />');
            div.hide();
            // Create a simple login button for administrators, since they can't do anything without being signed in.
            const btn = div.eadd('<button>Login</button>');
            div.eadd('<div class=loginmessage>Not logged in, try reloading.</div>');
            btn.on('click', async (e) => {
                // Trigger signin, which will cause authStateChanged afterwards
                await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
            });
            firebase.auth().onAuthStateChanged(async (user) => {
                div.eshow(user == null); // Show the login button and error if not signed in
                this.appDiv.eshow(user != null);
                if (user != null) {
                    // authenticated, OK to draw the GUI now
                    await this.start();
                }
            });
            return div;
        }
        // Called when user and taskset tables are finished loading
        async onDataChanged() {
            if (this.tasksets) {
                this.tasksets.onDataChanged();
            }
            if (this.users) {
                this.users.onDataChanged();
            }
            if (this.consents) {
                this.consents.onDataChanged();
            }
        }
        // Called when one or more taskset's task lists have changed
        async onTasksChanged() {
            if (this.tasksets) {
                await this.tasksets.onTasksChanged();
            }
        }
        // Called when one or more user's work lists have changed
        async onUserTasksChanged() {
            if (this.users) {
                await this.users.onUserTasksChanged();
            }
        }
        startUserView() {
            if (this.tasksets != null) {
                this.tasksets.remove();
                this.tasksets = undefined;
            }
            if (this.consents != null) {
                this.consents.remove();
                this.consents = undefined;
            }
            if (this.users == null) {
                this.users = new users_1.UsersView(this);
            }
            this.tasksetsButton.eenable(this.tasksets == null);
            this.usersButton.eenable(this.users == null);
            this.consentsButton.eenable(this.consents == null);
            this.users.start();
        }
        startTaskSetsView() {
            if (this.users != null) {
                this.users.remove();
                this.users = undefined;
            }
            if (this.consents != null) {
                this.consents.remove();
                this.consents = undefined;
            }
            if (this.tasksets == null) {
                this.tasksets = new tasksets_1.TaskSetsView(this);
            }
            this.tasksetsButton.eenable(this.tasksets == null);
            this.usersButton.eenable(this.users == null);
            this.consentsButton.eenable(this.consents == null);
            this.tasksets.start();
        }
        startConsentsView() {
            if (this.users != null) {
                this.users.remove();
                this.users = undefined;
            }
            if (this.tasksets != null) {
                this.tasksets.remove();
                this.tasksets = undefined;
            }
            if (this.consents == null) {
                this.consents = new consents_1.ConsentsView(this);
            }
            this.tasksetsButton.eenable(this.tasksets == null);
            this.usersButton.eenable(this.users == null);
            this.consentsButton.eenable(this.consents == null);
            this.consents.start();
        }
    }
    exports.AdminView = AdminView;
    // Go
    window['__audiotool_app'] = new AdminView();
});
//# sourceMappingURL=admin.js.map