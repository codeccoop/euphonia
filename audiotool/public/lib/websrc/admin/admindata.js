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
define(["require", "exports", "../util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdminData = void 0;
    // A DAO for data from the server. Also handles spinner and error UI.
    class AdminData {
        constructor(listener) {
            // We cache these big lists so we don't have to re-fetch them.
            this.users = new Map(); // by EUID
            this.tasksets = new Map(); // by TSID
            this.consents = new Map(); // by ConsentId
            this.listener = listener;
        }
        // Returns the user with the given email, if any
        findUserByEmail(email) {
            for (const user of this.users.values()) {
                if (user.email === email) {
                    return user;
                }
            }
            return undefined;
        }
        // Reloads the main lists of users and task sets
        async update() {
            await this.run(['users', 'tasksets', 'consents'], async () => {
                // TODO: we  could combine these into one endpoint to save a round trip
                for (const user of await (await (0, util_1.authenticatedFetch)('/api/admin/listusers')).json()) {
                    this.users.set(user.euid, user);
                }
                for (const ts of await (await (0, util_1.authenticatedFetch)('/api/admin/listtasksets')).json()) {
                    this.tasksets.set(ts.id, ts);
                }
                for (const c of await (await (0, util_1.authenticatedFetch)('/api/admin/listconsents')).json()) {
                    this.consents.set(c.id, c);
                }
            });
        }
        // Accesses the server, shows the user a spinner, and toasts on errors.
        async run(changes = ['data'], fn) {
            return await util_1.Spinner.waitFor(async () => {
                let result;
                try {
                    result = await fn();
                }
                catch (e) {
                    console.log(e);
                    (0, util_1.errorToast)(`${e}`);
                    result = undefined;
                }
                // Notify the app to update, even if there was an error
                if (changes.indexOf('users') !== -1 || changes.indexOf('tasksets') !== -1 || changes.indexOf('consents') !== -1) {
                    await this.listener.onDataChanged();
                }
                if (changes.indexOf('tasks') !== -1) {
                    await this.listener.onTasksChanged();
                }
                if (changes.indexOf('usertasks') !== -1) {
                    await this.listener.onUserTasksChanged();
                }
                return result;
            });
        }
        // Creates a user and updates the app with it
        async addUser(name, email, language, tags, notes) {
            await this.run(['users', 'tasksets'], async () => {
                const existingUser = this.findUserByEmail(email);
                if (existingUser) {
                    throw new Error(`Email already enrolled: ${email} is ${existingUser.euid}`);
                }
                const info = {
                    email, name, language, tags, notes,
                    signupTimestamp: 0
                };
                const [user, taskSets] = await (0, util_1.postAsJson)('/api/admin/newuser', info);
                this.users.set(user.euid, user);
                // TaskSets' counters can change during user creation because of enrollment rules
                for (const ts of taskSets) {
                    this.tasksets.set(ts.id, ts);
                }
            });
        }
        // Edits an existing user
        async editUser(euid, name, email, language, tags, notes) {
            await this.run(['users'], async () => {
                const info = { euid, email, name, language, tags, notes };
                const [user] = await (0, util_1.postAsJson)('/api/admin/edituser', info);
                this.users.set(user.euid, user);
            });
        }
        // Deletes an existing user
        async deleteUser(euid) {
            await this.run(['users'], async () => {
                const info = { euid };
                const [user] = await (0, util_1.postAsJson)('/api/admin/deleteuser', info);
                this.users.set(user.euid, user);
            });
        }
        // Assigns a selection of tasks to a list of users, returning which euids were successful.
        async assignTasks(euids, taskSetId, spec) {
            const rv = await this.run(['users', 'usertasks', 'tasksets'], async () => {
                const result = [];
                for (const euid of euids) {
                    const [user, ts] = await (0, util_1.postAsJson)('/api/admin/assigntasks', { taskSetId, euid, spec });
                    this.users.set(user.euid, user);
                    this.tasksets.set(ts.id, ts);
                    result.push(euid);
                }
                return result;
            });
            return rv ? rv : []; // an empty list means none were successful
        }
        // Deletes tasks from a user
        async removeTasks(euid, tasks) {
            const idTuples = tasks.map(task => [task.taskSetId, task.id]);
            await this.run(['users', 'usertasks', 'tasksets'], async () => {
                const [user, tslist] = await (0, util_1.postAsJson)('/api/admin/removetasks', { euid, idTuples });
                this.users.set(user.euid, user);
                for (const ts of tslist) {
                    this.tasksets.set(ts.id, ts);
                }
            });
        }
        // Creates a task set and updates the app with it
        async addTaskSet(id, name, language) {
            await this.run(['tasksets'], async () => {
                const [ts] = await (0, util_1.postAsJson)('/api/admin/newtaskset', { id, name, language });
                this.tasksets.set(ts.id, ts);
            });
        }
        // Adds an enrollment rule to a task set
        async addTaskSetRule(taskSetId, id, order, tags, action, sample) {
            const rule = {
                id, order, tags,
                allTasks: action === 'all',
                taskIds: [],
                sample: action === 'sample' ? sample : 0
            };
            await this.editTaskSet({
                taskSetId,
                delrules: [],
                addrules: [rule],
            });
        }
        // Removes an enrollment rule from a task set
        async deleteTaskSetRule(taskSetId, ruleId) {
            await this.editTaskSet({
                taskSetId,
                delrules: [ruleId],
                addrules: [],
            });
        }
        // Changes a task set's name and language
        async editTaskSetInfo(taskSetId, name, language) {
            await this.editTaskSet({
                taskSetId, name, language,
                delrules: [],
                addrules: [],
            });
        }
        // Changes a task set and updates it in the database
        async editTaskSet(info) {
            await this.run(['tasksets'], async () => {
                const [ts] = await (0, util_1.postAsJson)('/api/admin/edittaskset', info);
                this.tasksets.set(ts.id, ts);
            });
        }
        // Adds one task to a task set, with optional image
        async addTask(taskSetId, taskType, prompt, order, imageData) {
            await this.run(['tasksets', 'tasks'], async () => {
                const newTasks = await (0, util_1.postAsJson)('/api/admin/newtask', { taskSetId, prompt, order, taskType });
                if (newTasks.length > 0 && imageData) {
                    // Convert this to an image task
                    const args = { taskSetId, taskId: newTasks[0].id };
                    await (0, util_1.authenticatedFetch)('/api/admin/uploadtaskimage', args, 'post', imageData);
                    // TODO: we could receive and update taskset proto here instead of reloading the whole thing
                }
            });
        }
        // Adds tasks from an uploaded CSV file to a task set
        async bulkUploadTasks(taskSetId, data, orderStart) {
            await this.run(['tasksets', 'tasks'], async () => {
                const format = 'txt';
                await (0, util_1.authenticatedFetch)('/api/admin/bulkaddtasks', { taskSetId, format, orderStart }, 'post', data);
                // TODO: we could receive and update taskset proto here instead of reloading the whole thing
            });
        }
        // Fetches the full task list for a taskset.
        async loadTasksetTasks(taskSetId) {
            const rv = await this.run(['tasksets'], async () => {
                const rsp = await (0, util_1.authenticatedFetch)('/api/admin/listtasks', { taskSetId });
                const [taskset, tasks] = await rsp.json();
                if (!taskset || !tasks) {
                    throw new Error('Unexpected empty result from task fetch');
                }
                this.tasksets.set(taskset.id, taskset);
                return tasks;
            });
            return rv ? rv : []; // empty result on errors
        }
        // Gets the detailed list of user tasks and recordings.
        async loadUserWork(euid) {
            const rv = await this.run(['users'], async () => {
                const rsp = await (0, util_1.authenticatedFetch)('/api/admin/listuserwork', { euid });
                const [user, tasks, recordings] = await rsp.json();
                if (!user || !tasks || !recordings) {
                    throw new Error('Unexpected empty result from user fetch');
                }
                this.users.set(user.euid, user);
                const result = [tasks, recordings];
                return result;
            });
            return rv ? rv : [[], []]; // empty result on errors
        }
        // Creates a consent and updates the app with it
        async addConsent(id, name, language, tags, optional) {
            await this.run(['consents'], async () => {
                const [consent] = await (0, util_1.postAsJson)('/api/admin/newconsent', { id, name, language, tags, optional });
                this.consents.set(consent.id, consent);
            });
        }
        // Changes a consent's metadata
        async editConsentInfo(id, name, language, tags, active, optional) {
            await this.run(['consents'], async () => {
                const [consent] = await (0, util_1.postAsJson)('/api/admin/editconsent', { id, name, language, tags, active, optional });
                this.consents.set(consent.id, consent);
            });
        }
        // Uploads a new consent document
        async addConsentVersion(id, description, liveTimestamp, html) {
            await this.run(['consents'], async () => {
                const args = { id, description, liveTimestamp };
                const rsp = await (0, util_1.authenticatedFetch)('/api/admin/uploadconsentversion', args, 'post', html);
                const [consent] = await rsp.json();
                this.consents.set(consent.id, consent);
            });
        }
        async deleteConsentVersion(id, version) {
            await this.run(['consents'], async () => {
                const [consent] = await (0, util_1.postAsJson)('/api/admin/deleteconsentversion', { id, version });
                this.consents.set(consent.id, consent);
            });
        }
    }
    exports.AdminData = AdminData;
});
//# sourceMappingURL=admindata.js.map