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
// Just the type definitions for the schema we store and transmit.
export var MAX_DELETABLE_RECORDING_AGE_MS = 24 * 3600 * 1000; // 24 hours
// Supported languages
export var SUPPORTED_LANGUAGES = new Set([
    "en-US",
    "en-GB",
    "fr-FR",
    "es-ES",
    "hi-HI",
    "ja-JP",
]);
// Paths of documents, collections, and sub-collections
export var USERS_TABLE = "EUsers";
export var TASKS_SUBCOLLECTION = "tasks";
export var RECORDINGS_TABLE = "ERecordings";
export var RECORDINGS_SUBCOLLECTION = "recordings";
export var TASKSETS_TABLE = "ETaskSets";
export var CONSENTS_TABLE = "EConsents";
export function userPath(euid) {
    return "".concat(USERS_TABLE, "/").concat(euid);
}
export function userTaskPath(euid, taskId) {
    return "".concat(USERS_TABLE, "/").concat(euid, "/").concat(TASKS_SUBCOLLECTION, "/").concat(taskId);
}
export function recordingPath(euid, timestamp) {
    var tsid = "".concat(timestamp).padStart(20, "0");
    return "".concat(RECORDINGS_TABLE, "/").concat(euid, "/").concat(RECORDINGS_SUBCOLLECTION, "/").concat(tsid);
}
export function taskSetPath(tsid) {
    return "".concat(TASKSETS_TABLE, "/").concat(tsid);
}
export function taskPath(tsid, taskId) {
    return "".concat(TASKSETS_TABLE, "/").concat(tsid, "/").concat(TASKS_SUBCOLLECTION, "/").concat(taskId);
}
export function consentPath(cid) {
    return "".concat(CONSENTS_TABLE, "/").concat(cid);
}
//# sourceMappingURL=schema.js.map