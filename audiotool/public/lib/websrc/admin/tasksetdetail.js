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
define(["require", "exports", "../util", "../../commonsrc/util", "../dialog", "../../commonsrc/schema"], function (require, exports, util_1, util_2, dialog_1, schema) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TaskSetDetailView = void 0;
    schema = __importStar(schema);
    class TaskSetDetailView {
        constructor(parent, taskset) {
            this.lastOrder = 0;
            this.data = parent.app.data;
            this.parent = parent;
            this.taskset = taskset;
            this.div = parent.app.main.eadd('<div id=tasksetdetailview />');
            this.tsinfo = this.div.eadd('<div class=tasksetinfo />');
            // Enrollment rules area
            this.div.eadd('<h2 />').etext('Enrollment Rules');
            this.rulesTable = this.div.eadd('<table class=rules />');
            this.newRuleButton = this.div.eadd('<button class=addrule>Add Rule</button>');
            this.newRuleButton.on('click', async (e) => await new AddRuleDialog(this).start());
            // Tasks list area
            this.div.eadd('<h2 />').etext('Tasks');
            this.taskStats = this.div.eadd('<div class=taskstats />');
            this.tasksTable = this.div.eadd('<table class=tasks />');
            const buttonbar = this.div.eadd('<div class=buttonbar />');
            this.newPromptTaskButton = buttonbar.eadd('<button>Add Prompt Task</button>');
            this.newPromptTaskButton.on('click', async (e) => await new AddPromptTaskDialog(this).start());
            this.newImageTaskButton = buttonbar.eadd('<button>Add Image Task</button>');
            this.newImageTaskButton.on('click', async (e) => await new AddImageTaskDialog(this).start());
            this.bulkTasksButton = buttonbar.eadd('<button>Bulk Upload Tasks</button>');
            this.bulkTasksButton.on('click', async (e) => await new BulkTaskDialog(this).start());
            // Fill in the TaskSet Values and rules list
            this.fillTaskSetInfo();
        }
        // Fills in the task set details like name and rules
        fillTaskSetInfo() {
            this.tsinfo.empty();
            this.tsinfo.eadd('<div class=title />').text(`TaskSet: ${this.taskset.id}`);
            const desc = this.tsinfo.eadd('<div class=description />').etext(`${this.taskset.name}`);
            desc.eadd('<span class=language />').etext(` (${this.taskset.language})`);
            desc.eadd('<a class=editlink />').etext('[edit]').on('click', async (e) => await this.startEdit());
            this.taskStats.text(`${this.taskset.numAssignedTasks} assignments across ${this.taskset.numAssignedUsers} users`);
            // Fill in the list of enrollment rules
            this.rulesTable.html('<tr><th>Order</th><th>Tags</th><th>Action</th><th class=buttoncol></th></tr>');
            for (const rule of this.taskset.rules) {
                const ruleId = rule.id;
                let action = '';
                if (rule.allTasks) {
                    action = 'Assign all';
                }
                else if (rule.taskIds.length > 0) {
                    action = `Assign ${rule.taskIds.length} specific tasks`;
                }
                else if (rule.sample > 0) {
                    action = `Randomly assign up to ${rule.sample} tasks`;
                }
                else {
                    action = 'none';
                }
                const tr = this.rulesTable.eadd('<tr />');
                tr.eadd('<td />').etext(`${rule.order}`);
                tr.eadd('<td />').etext(`${rule.tags.join(' ')}`);
                tr.eadd('<td />').etext(`${action}`);
                const delbtn = tr.eadd('<td />').eadd('<button class=delrulebtn />').etext('Delete');
                delbtn.on('click', async (e) => await this.deleteRule(ruleId));
            }
            this.parent.app.setNav(`/taskset/${this.taskset.id}`);
        }
        // Displays the view
        async start() {
            this.parent.div.hide();
            this.div.show();
            await this.onTasksChanged();
        }
        // Cleans up this view
        remove() {
            this.div.remove();
            this.parent.div.show();
        }
        // Update the GUI for any changes to the task set
        onDataChanged() {
            this.taskset = this.data.tasksets.get(this.taskset.id);
            this.fillTaskSetInfo();
        }
        // Fetch the task list from the server. We don't cache this.
        async onTasksChanged() {
            await util_1.Spinner.waitFor(async () => {
                const taskSetId = this.taskset.id;
                this.tasks = await this.parent.app.data.loadTasksetTasks(taskSetId);
                this.tasksTable.html(`<tr><th>Order</th><th>Type</th><th>Prompt</th><th>Created</th><th>Recordings</th></tr>`);
                for (const task of this.tasks) {
                    if (this.lastOrder < task.order) {
                        this.lastOrder = task.order;
                    }
                    const tr = this.tasksTable.eadd('<tr />');
                    tr.eadd('<td class=num />').text(task.order);
                    tr.eadd('<td class=tasktype />').text(task.taskType);
                    const ptd = tr.eadd('<td class=prompt />');
                    ptd.eadd('<span class=label />').text(task.prompt);
                    if (task.imageType) {
                        const args = { taskSetId, taskId: task.id, mimeType: task.imageType };
                        const imageURL = (0, util_1.toURL)('/api/gettaskimage', args);
                        ptd.eadd('<a class=imglink target=_blank />').etext('[image]').prop('href', imageURL);
                    }
                    tr.eadd('<td class=created />').text((0, util_2.formatTimestamp)(task.creationTimestamp));
                    tr.eadd('<td class=num />').etext(`${task.numRecordings}`);
                }
            });
        }
        // Shows the edit taskset dialog
        async startEdit() {
            await new EditTasksetDialog(this).start();
        }
        // Deletes a rule
        async deleteRule(ruleId) {
            const confirm = await dialog_1.ChoiceDialog.choose('Delete this rule?', 'Delete', 'Cancel');
            if (confirm !== 'Delete') {
                return;
            }
            await util_1.Spinner.waitFor(async () => {
                await this.parent.app.data.deleteTaskSetRule(this.taskset.id, ruleId);
            });
        }
        // Fires the task addition RPC
        async addPromptTask(prompt) {
            await util_1.Spinner.waitFor(async () => {
                await this.parent.app.data.addTask(this.taskset.id, 'prompt', prompt, this.lastOrder + 1);
            });
        }
        // Creates a response type task and then attaches an image to it
        async addImageTask(prompt, imageData) {
            await util_1.Spinner.waitFor(async () => {
                await this.parent.app.data.addTask(this.taskset.id, 'response', prompt, this.lastOrder + 1, imageData);
            });
        }
        // Bulk uploads a file of prompts
        async bulkUploadTasks(data) {
            await util_1.Spinner.waitFor(async () => {
                await this.parent.app.data.bulkUploadTasks(this.taskset.id, data, this.lastOrder + 1);
            });
        }
    }
    exports.TaskSetDetailView = TaskSetDetailView;
    class AddPromptTaskDialog extends dialog_1.Dialog {
        constructor(parent) {
            super('addtaskdialog');
            this.parent = parent;
            this.div.eadd('<label />').text('Prompt:');
            const promptField = this.div.eadd('<input type=text name=prompt />');
            this.div.eadd('<button>Add Prompt</button>').on('click', async (e) => {
                const prompt = promptField.val();
                if (!prompt) {
                    (0, util_1.toast)('Missing required fields');
                    return;
                }
                await parent.addPromptTask(prompt);
                await this.remove();
            });
            const cancelButton = this.div.eadd('<button>Cancel</button>');
            cancelButton.on('click', async (e) => await this.remove());
        }
    }
    class AddImageTaskDialog extends dialog_1.Dialog {
        constructor(parent) {
            super('addimagetaskdialog');
            this.parent = parent;
            this.div.eadd('<div class=title />').text('Add Image Task');
            this.startForm();
            const promptField = this.addFormField('Prompt:', '<input type=text name=prompt />');
            const fileField = this.addFormField('Image:', '<input type=file name=imagefile />');
            const buttonTd = this.formTable.eadd('<tr />').eadd('<td colspan=2 class=buttonbox />');
            buttonTd.eadd('<button>Upload Image Task</button>').on('click', async (e) => {
                const prompt = promptField.val();
                const files = fileField.prop('files');
                if (!prompt) {
                    (0, util_1.toast)('Missing required fields');
                    return;
                }
                if (!files || files.length !== 1 || !this.isJpeg(files[0])) {
                    (0, util_1.toast)('Please choose a JPEG image');
                    return;
                }
                await parent.addImageTask(prompt, await files[0].arrayBuffer());
                await this.remove();
            });
            const cancelButton = buttonTd.eadd('<button>Cancel</button>');
            cancelButton.on('click', async (e) => await this.remove());
        }
        isJpeg(file) {
            const filename = file.name.toLowerCase();
            return filename.endsWith('.jpeg') || filename.endsWith('.jpg');
        }
    }
    class AddRuleDialog extends dialog_1.Dialog {
        constructor(parent) {
            super('addruledialog');
            this.parent = parent;
            this.div.eadd('<h2 />').etext('Add Enrollment Rule').eadd('<hr />');
            this.startForm();
            this.orderField = this.addFormField('Priority:', '<input type=text name=order />');
            this.tagsField = this.addFormField('Tags:', '<input type=text name=tags />');
            // Radio buttons
            const choices = this.addFormField('Assignment Action:', '<div class=choices />');
            this.allChoice = choices.eadd('<input type=radio class=radio name=action value=all id=allradio />');
            this.allChoice.echecked(true);
            choices.eadd('<label for=allradio />').text('Assign all tasks from this taskset');
            choices.eadd('<br />');
            this.sampleChoice = choices.eadd('<input type=radio class=radio name=action value=sample id=sampleradio />');
            choices.eadd('<label for=sampleradio />').text('Assign a random subset from this taskset');
            // Sample size is only enabled for the sampling choice
            this.sampleSize = this.addFormField('Sample size:', '<input type=text name=samplesize />');
            this.sampleSize.eenable(false);
            this.sampleChoice.on('change', e => this.sampleSize.eenable(this.sampleChoice.is(':checked')));
            this.allChoice.on('change', e => this.sampleSize.eenable(this.sampleChoice.is(':checked')));
            // Action buttons
            const buttonTd = this.formTable.eadd('<tr />').eadd('<td colspan=2 class=buttonbox />');
            buttonTd.eadd('<button>Create Rule</button>').on('click', async (e) => await this.handleAddRule());
            buttonTd.eadd('<button>Cancel</button>').on('click', async (e) => await this.remove());
        }
        async handleAddRule() {
            const order = Number(this.orderField.val());
            const tags = (0, util_2.parseTags)(this.tagsField.val());
            const action = this.allChoice.is(':checked') ? 'all' : this.sampleChoice.is(':checked') ? 'sample' : '';
            const sample = Number(this.sampleSize.val());
            if (!order || !action || isNaN(order) || (action === 'sample' && isNaN(sample))) {
                (0, util_1.toast)('Missing required fields');
                return;
            }
            let lastId = 1;
            for (const rule of this.parent.taskset.rules) {
                lastId = Math.max(lastId, rule.id);
                if (rule.order === order) {
                    (0, util_1.toast)('Order already in use');
                    return;
                }
            }
            await util_1.Spinner.waitFor(async () => {
                await this.parent.parent.app.data.addTaskSetRule(this.parent.taskset.id, lastId + 1, order, tags, action, sample);
                await this.remove();
            });
        }
    }
    class BulkTaskDialog extends dialog_1.Dialog {
        constructor(parent) {
            super('bulktaskdialog');
            this.parent = parent;
            this.div.eadd('<label />').text('Text file of prompts:');
            const fileField = this.div.eadd('<input type=file name=promptsfile />');
            const uploadButton = this.div.eadd('<button>Upload</button>');
            uploadButton.on('click', async (e) => {
                const files = fileField.prop('files');
                if (!files || files.length !== 1) {
                    (0, util_1.toast)('Please choose a file');
                    return;
                }
                await parent.bulkUploadTasks(await files[0].arrayBuffer());
                await this.remove();
            });
            this.div.eadd('<button>Cancel</button>').on('click', async (e) => await this.remove());
        }
    }
    class EditTasksetDialog extends dialog_1.Dialog {
        constructor(parent) {
            super('edittasksetdialog');
            this.parent = parent;
            this.div.eadd('<div class=title />').text(`Edit Taskset: ${parent.taskset.id}`);
            this.startForm();
            const nameField = this.addFormField('Description:', '<input type=text name=name />');
            const languageField = this.addFormField('Language:', '<input type=text name=language />');
            nameField.val(parent.taskset.name);
            languageField.val(parent.taskset.language);
            const buttonTd = this.formTable.eadd('<tr />').eadd('<td colspan=2 class=buttonbox />');
            buttonTd.eadd('<button>Save</button>').on('click', async (e) => {
                const name = nameField.val();
                const lang = languageField.val();
                if (!name || !lang) {
                    (0, util_1.toast)('Missing required fields');
                    return;
                }
                if (!schema.SUPPORTED_LANGUAGES.has(lang)) {
                    (0, util_1.toast)(`Unsupported language: ${lang}`);
                    return;
                }
                await util_1.Spinner.waitFor(async () => {
                    await parent.data.editTaskSetInfo(parent.taskset.id, name, lang);
                    await this.remove();
                });
            });
            buttonTd.eadd('<button>Cancel</button>').on('click', async (e) => await this.remove());
        }
    }
});
//# sourceMappingURL=tasksetdetail.js.map