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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Makes a string like YYYYMMDDHHMMSS out of a Date
export function formatDateCode(date) {
    var month = "".concat(date.getMonth() + 1).padStart(2, "0");
    var day = "".concat(date.getDate()).padStart(2, "0");
    var hour = "".concat(date.getHours()).padStart(2, "0");
    var minute = "".concat(date.getMinutes()).padStart(2, "0");
    var second = "".concat(date.getSeconds()).padStart(2, "0");
    return "".concat(date.getFullYear()).concat(month).concat(day).concat(hour).concat(minute).concat(second);
}
// Makes a human-readable date out of a Date
export function formatDate(date) {
    var e_1, _a;
    // Destructure the date
    var f = new Intl.DateTimeFormat("en-us", {
        dateStyle: "short",
        timeStyle: "long",
    });
    var parts = {
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        dayPeriod: "",
        timeZoneName: "",
    };
    try {
        for (var _b = __values(f.formatToParts(date)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = _c.value, type = _d.type, value = _d.value;
            parts[type] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Return a sortable datetime
    var d = "20".concat(parts.year.padStart(2, "0"), "/").concat(parts.month.padStart(2, "0"), "/").concat(parts.day.padStart(2, "0"));
    var t = "".concat(parts.hour.padStart(2, "0"), ":").concat(parts.minute.padStart(2, "0")).concat(parts.dayPeriod.toLowerCase());
    return "".concat(d, " ").concat(t, " ").concat(parts.timeZoneName);
}
// Same as above, but formats a timestamp
export function formatTimestamp(ts, opt_noneValue) {
    if (ts < 1) {
        return opt_noneValue ? opt_noneValue : "-";
    }
    else {
        return formatDate(new Date(ts));
    }
}
// Returns a Date from a string, or undefined if could not parse
export function parseTimestamp(text) {
    var d = new Date(text);
    return isNaN(d.getTime()) ? undefined : d.getTime();
}
// Parses a normalized array of tags from the given user inputted string of space-separated tags.
export function parseTags(tagsString) {
    if (!tagsString) {
        return [];
    }
    var obj = tagsString.split(/\s+/);
    return __spreadArray([], __read(obj
        .map(function (tag) { return normalizeTag(tag); })
        .filter(function (tag) { return (tag !== "" ? true : false); })), false);
}
// Returns a canonicalized version of one tag string
export function normalizeTag(tag) {
    if (!tag) {
        return "";
    }
    tag = tag.trim().toLowerCase();
    tag = tag.replace(/[^a-z0-9_]/g, "");
    return tag;
}
// Returns a canonicalized version of the given array of tags
export function normalizeTags(tags) {
    return __spreadArray([], __read(tags
        .filter(function (tag) { return (tag ? tag.trim() !== "" : false); })
        .map(function (tag) { return normalizeTag(tag); })), false);
}
// Shuffles a given array in place using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle.
export function shuffle(list) {
    var len = list.length;
    var len1 = len - 1;
    for (var i = 0; i < len1; i++) {
        var j = i + Math.floor(Math.random() * (len - i));
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
    return list;
}
// Yields the given array as a sequence of slices of the given size.
export function toBatches(list, size) {
    var e_2, _a;
    var result = [];
    var batch = [];
    try {
        for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
            var item = list_1_1.value;
            batch.push(item);
            if (batch.length >= size) {
                result.push(batch);
                batch = [];
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (batch.length > 0) {
        result.push(batch);
    }
    return result;
}
// Removes all matching items from an array, and returns the number removed.
export function findAndRemove(list, item) {
    var count = 0;
    while (true) {
        var index = list.indexOf(item);
        if (index === -1) {
            return count;
        }
        list.splice(index, 1);
        count++;
    }
}
// Returns a sorted version of the given list without mutating it.
export function sorted(list, predicate) {
    var result = __spreadArray([], __read(list), false);
    result.sort(predicate);
    return result;
}
// Returns a deep copy of the given object's JSON'able properties
export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// Returns true if the given item is one of the given list items.
export function listhas(item) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return list.indexOf(item) !== -1;
}
// Returns the last item in an iterable
export function lastitem(items) {
    var e_3, _a;
    var last = undefined;
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            last = item;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return last;
}
// Encodes an array of binary data as a base64 string.
export function toBase64(buffer) {
    var result = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return window.btoa(result);
}
// An accumulator for audio data; encodes a .WAV file at the end.
var WavBuilder = /** @class */ (function () {
    function WavBuilder() {
        this.chunks = [];
        this.sampleRate = 0;
        this.recordedSize = 0;
    }
    WavBuilder.prototype.setSampleRate = function (rate) {
        this.sampleRate = rate;
    };
    WavBuilder.prototype.addData = function (data) {
        data = new Float32Array(data); // superstitious coersion for iPad
        if (data.length > 0) {
            this.chunks.push(data);
            this.recordedSize += data.length;
        }
    };
    // Returns a ready-to-upload binary wav file.
    WavBuilder.prototype.build = function () {
        var e_4, _a;
        var buffer = new ArrayBuffer(44 + this.recordedSize * 2);
        var view = new DataView(buffer);
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
        var offset = 44;
        try {
            for (var _b = __values(this.chunks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var chunk = _c.value;
                for (var i = 0; i < chunk.length; i++) {
                    var s = Math.max(-1, Math.min(1, chunk[i]));
                    view.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
                    offset += 2;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return view.buffer;
    };
    WavBuilder.prototype.setText = function (view, offset, str) {
        for (var pos = 0; pos < str.length; pos++) {
            view.setUint8(offset + pos, str.charCodeAt(pos));
        }
    };
    return WavBuilder;
}());
export { WavBuilder };
//# sourceMappingURL=util.js.map