"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentPath = exports.taskPath = exports.taskSetPath = exports.recordingPath = exports.userTaskPath = exports.userPath = exports.CONSENTS_TABLE = exports.TASKSETS_TABLE = exports.RECORDINGS_SUBCOLLECTION = exports.RECORDINGS_TABLE = exports.TASKS_SUBCOLLECTION = exports.USERS_TABLE = exports.SUPPORTED_LANGUAGES = exports.MAX_DELETABLE_RECORDING_AGE_MS = void 0;
// Just the type definitions for the schema we store and transmit.
exports.MAX_DELETABLE_RECORDING_AGE_MS = 24 * 3600 * 1000; // 24 hours
// Supported languages
exports.SUPPORTED_LANGUAGES = new Set([
    "en-US",
    "en-GB",
    "fr-FR",
    "es-ES",
    "hi-HI",
    "ja-JP",
]);
// Paths of documents, collections, and sub-collections
exports.USERS_TABLE = "EUsers";
exports.TASKS_SUBCOLLECTION = "tasks";
exports.RECORDINGS_TABLE = "ERecordings";
exports.RECORDINGS_SUBCOLLECTION = "recordings";
exports.TASKSETS_TABLE = "ETaskSets";
exports.CONSENTS_TABLE = "EConsents";
function userPath(euid) {
    return `${exports.USERS_TABLE}/${euid}`;
}
exports.userPath = userPath;
function userTaskPath(euid, taskId) {
    return `${exports.USERS_TABLE}/${euid}/${exports.TASKS_SUBCOLLECTION}/${taskId}`;
}
exports.userTaskPath = userTaskPath;
function recordingPath(euid, timestamp) {
    const tsid = `${timestamp}`.padStart(20, "0");
    return `${exports.RECORDINGS_TABLE}/${euid}/${exports.RECORDINGS_SUBCOLLECTION}/${tsid}`;
}
exports.recordingPath = recordingPath;
function taskSetPath(tsid) {
    return `${exports.TASKSETS_TABLE}/${tsid}`;
}
exports.taskSetPath = taskSetPath;
function taskPath(tsid, taskId) {
    return `${exports.TASKSETS_TABLE}/${tsid}/${exports.TASKS_SUBCOLLECTION}/${taskId}`;
}
exports.taskPath = taskPath;
function consentPath(cid) {
    return `${exports.CONSENTS_TABLE}/${cid}`;
}
exports.consentPath = consentPath;
//# sourceMappingURL=schema.js.map