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
exports.WavBuilder = exports.toBase64 = exports.lastitem = exports.listhas = exports.clone = exports.sorted = exports.findAndRemove = exports.toBatches = exports.shuffle = exports.normalizeTags = exports.normalizeTag = exports.parseTags = exports.parseTimestamp = exports.formatTimestamp = exports.formatDate = exports.formatDateCode = void 0;
// Makes a string like YYYYMMDDHHMMSS out of a Date
function formatDateCode(date) {
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hour = `${date.getHours()}`.padStart(2, "0");
    const minute = `${date.getMinutes()}`.padStart(2, "0");
    const second = `${date.getSeconds()}`.padStart(2, "0");
    return `${date.getFullYear()}${month}${day}${hour}${minute}${second}`;
}
exports.formatDateCode = formatDateCode;
// Makes a human-readable date out of a Date
function formatDate(date) {
    // Destructure the date
    const f = new Intl.DateTimeFormat("en-us", {
        dateStyle: "short",
        timeStyle: "long",
    });
    const parts = {
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        dayPeriod: "",
        timeZoneName: "",
    };
    for (const { type, value } of f.formatToParts(date)) {
        parts[type] = value;
    }
    // Return a sortable datetime
    const d = `20${parts.year.padStart(2, "0")}/${parts.month.padStart(2, "0")}/${parts.day.padStart(2, "0")}`;
    const t = `${parts.hour.padStart(2, "0")}:${parts.minute.padStart(2, "0")}${parts.dayPeriod.toLowerCase()}`;
    return `${d} ${t} ${parts.timeZoneName}`;
}
exports.formatDate = formatDate;
// Same as above, but formats a timestamp
function formatTimestamp(ts, opt_noneValue) {
    if (ts < 1) {
        return opt_noneValue ? opt_noneValue : "-";
    }
    else {
        return formatDate(new Date(ts));
    }
}
exports.formatTimestamp = formatTimestamp;
// Returns a Date from a string, or undefined if could not parse
function parseTimestamp(text) {
    const d = new Date(text);
    return isNaN(d.getTime()) ? undefined : d.getTime();
}
exports.parseTimestamp = parseTimestamp;
// Parses a normalized array of tags from the given user inputted string of space-separated tags.
function parseTags(tagsString) {
    if (!tagsString) {
        return [];
    }
    const obj = tagsString.split(/\s+/);
    return [
        ...obj
            .map((tag) => normalizeTag(tag))
            .filter((tag) => (tag !== "" ? true : false)),
    ];
}
exports.parseTags = parseTags;
// Returns a canonicalized version of one tag string
function normalizeTag(tag) {
    if (!tag) {
        return "";
    }
    tag = tag.trim().toLowerCase();
    tag = tag.replace(/[^a-z0-9_]/g, "");
    return tag;
}
exports.normalizeTag = normalizeTag;
// Returns a canonicalized version of the given array of tags
function normalizeTags(tags) {
    return [
        ...tags
            .filter((tag) => (tag ? tag.trim() !== "" : false))
            .map((tag) => normalizeTag(tag)),
    ];
}
exports.normalizeTags = normalizeTags;
// Shuffles a given array in place using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle.
function shuffle(list) {
    const len = list.length;
    const len1 = len - 1;
    for (let i = 0; i < len1; i++) {
        const j = i + Math.floor(Math.random() * (len - i));
        const tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
    return list;
}
exports.shuffle = shuffle;
// Yields the given array as a sequence of slices of the given size.
function toBatches(list, size) {
    const result = [];
    let batch = [];
    for (const item of list) {
        batch.push(item);
        if (batch.length >= size) {
            result.push(batch);
            batch = [];
        }
    }
    if (batch.length > 0) {
        result.push(batch);
    }
    return result;
}
exports.toBatches = toBatches;
// Removes all matching items from an array, and returns the number removed.
function findAndRemove(list, item) {
    let count = 0;
    while (true) {
        const index = list.indexOf(item);
        if (index === -1) {
            return count;
        }
        list.splice(index, 1);
        count++;
    }
}
exports.findAndRemove = findAndRemove;
// Returns a sorted version of the given list without mutating it.
function sorted(list, predicate) {
    const result = [...list];
    result.sort(predicate);
    return result;
}
exports.sorted = sorted;
// Returns a deep copy of the given object's JSON'able properties
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.clone = clone;
// Returns true if the given item is one of the given list items.
function listhas(item, ...list) {
    return list.indexOf(item) !== -1;
}
exports.listhas = listhas;
// Returns the last item in an iterable
function lastitem(items) {
    let last = undefined;
    for (const item of items) {
        last = item;
    }
    return last;
}
exports.lastitem = lastitem;
// Encodes an array of binary data as a base64 string.
function toBase64(buffer) {
    let result = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return window.btoa(result);
}
exports.toBase64 = toBase64;
// An accumulator for audio data; encodes a .WAV file at the end.
class WavBuilder {
    constructor() {
        this.chunks = [];
        this.sampleRate = 0;
        this.recordedSize = 0;
    }
    setSampleRate(rate) {
        this.sampleRate = rate;
    }
    addData(data) {
        data = new Float32Array(data); // superstitious coersion for iPad
        if (data.length > 0) {
            this.chunks.push(data);
            this.recordedSize += data.length;
        }
    }
    // Returns a ready-to-upload binary wav file.
    build() {
        const buffer = new ArrayBuffer(44 + this.recordedSize * 2);
        const view = new DataView(buffer);
        // Build the boilerplate WAV header
        this.setText(view, 0, "RIFF");
        view.setUint32(4, 36 + this.recordedSize * 2, true);
        this.setText(view, 8, "WAVE");
        this.setText(view, 12, "fmt ");
        view.setUint32(16, 16, true); // sample size (bits)
        view.setUint16(20, 1, true); // raw format
        view.setUint16(22, 1, true); // 1 channel
        view.setUint32(24, this.sampleRate, true);
        view.setUint32(28, this.sampleRate * 2, true); // byte rate
        view.setUint16(32, 2, true); // sample size (bytes)
        view.setUint16(34, 16, true); // sample size (bits)
        this.setText(view, 36, "data");
        view.setUint32(40, this.recordedSize * 2, true);
        // Add all the chunks
        let offset = 44;
        for (const chunk of this.chunks) {
            for (let i = 0; i < chunk.length; i++) {
                const s = Math.max(-1, Math.min(1, chunk[i]));
                view.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
                offset += 2;
            }
        }
        return view.buffer;
    }
    setText(view, offset, str) {
        for (let pos = 0; pos < str.length; pos++) {
            view.setUint8(offset + pos, str.charCodeAt(pos));
        }
    }
}
exports.WavBuilder = WavBuilder;
//# sourceMappingURL=util.js.map