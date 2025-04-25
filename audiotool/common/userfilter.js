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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
// A simple parser for user filter queries.
var UserFilter = /** @class */ (function () {
    function UserFilter() {
    }
    UserFilter.parse = function (text) {
        var e_1, _a;
        var predicates = [];
        try {
            for (var _b = __values(UserFilter.tokenize(text)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                // Allow putting a minus sign in front of any token to negate it
                var isNegated = false;
                if (token.startsWith("-")) {
                    isNegated = true;
                    token = token.substring(1);
                }
                // Parse the structured predicates; this falls back to text search if there's no other match
                var fn = UserFilter.parseToken(token);
                predicates.push(isNegated ? UserFilter.notFn(fn) : fn);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return UserFilter.andFn(predicates);
    };
    // Returns a predicate function for the given token; does not handle negation or errors.
    UserFilter.parseToken = function (token) {
        if (token.startsWith("tag:")) {
            // Match tags exactly
            var wantTag = token.substring(4);
            return UserFilter.tagFn(wantTag);
        }
        else if (token.startsWith("taglike:")) {
            // Match tag substrings
            var wantTag = token.substring(8).toLowerCase();
            return UserFilter.tagLikeFn(wantTag);
        }
        else if (token.startsWith("language:")) {
            // Match language
            var lang = token.substring(9).toLowerCase();
            return UserFilter.languageFn(lang);
        }
        else if (token.startsWith("lastrecorded:")) {
            // Match users who recorded on or after a given date
            var timestamp = UserFilter.parseDate(token.substring("lastrecorded:".length));
            return UserFilter.lastRecordedFn(timestamp);
        }
        else if (token.startsWith("created:")) {
            // Match user records that were created on or after a given date
            var timestamp = UserFilter.parseDate(token.substring("created:".length));
            return UserFilter.createdFn(timestamp);
        }
        else if (token.startsWith("recordings:")) {
            // Match users with at least this number of recordings
            var num = parseInt(token.substring("recordings:".length));
            return UserFilter.recordingsFn(num);
        }
        else if (token.startsWith("tasks:")) {
            // Match users with at least this number of assigned tasks
            var num = parseInt(token.substring("tasks:".length));
            return UserFilter.tasksFn(num);
        }
        else if (token.startsWith("remainingtasks:")) {
            // Match users with at least this number of assigned tasks
            var num = parseInt(token.substring("remainingtasks:".length));
            return UserFilter.tasksRemainingFn(num);
        }
        else {
            // Match freeform text
            return UserFilter.textMatchFn(token);
        }
    };
    UserFilter.andFn = function (fns) {
        return function (user) {
            var e_2, _a;
            try {
                for (var fns_1 = __values(fns), fns_1_1 = fns_1.next(); !fns_1_1.done; fns_1_1 = fns_1.next()) {
                    var fn = fns_1_1.value;
                    if (!fn(user)) {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (fns_1_1 && !fns_1_1.done && (_a = fns_1.return)) _a.call(fns_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        };
    };
    UserFilter.notFn = function (fn) {
        return function (user) { return !fn(user); };
    };
    // Returns a predicate that matches users with exactly the given tag.
    UserFilter.tagFn = function (wantTag) {
        return function (user) {
            var e_3, _a;
            try {
                for (var _b = __values(user.tags), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tag = _c.value;
                    if (tag == wantTag) {
                        return true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return false;
        };
    };
    // Returns a predicate that matches users with at least one tag similar to the given tag.
    UserFilter.tagLikeFn = function (wantTag) {
        return function (user) {
            var e_4, _a;
            try {
                for (var _b = __values(user.tags), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tag = _c.value;
                    if (tag.toLowerCase().indexOf(wantTag) != -1) {
                        return true;
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
            return false;
        };
    };
    // Returns a predicate that matches users with the given language.
    UserFilter.languageFn = function (lang) {
        lang = lang.toLowerCase();
        return function (user) {
            return !!user.language && user.language.toLowerCase().indexOf(lang) != -1;
        };
    };
    // Returns a predicate that matches users who were created on or after the given timestamp.
    UserFilter.createdFn = function (timestamp) {
        return function (user) { return timestamp <= user.createTimestamp; };
    };
    // Returns a predicate that matches users who last recorded on or after the given timestamp.
    UserFilter.lastRecordedFn = function (timestamp) {
        return function (user) { return timestamp <= user.lastRecordingTimestamp; };
    };
    // Returns a predicate that matches users with at least the given number of recordings.
    UserFilter.recordingsFn = function (num) {
        if (isNaN(num)) {
            return function (x) { return false; };
        }
        return function (user) { return num <= (user.numRecordings ? user.numRecordings : 0); };
    };
    // Returns a predicate that matches users with at least the given number of tasks.
    UserFilter.tasksFn = function (num) {
        if (isNaN(num)) {
            return function (x) { return false; };
        }
        return function (user) { return num <= (user.numTasks ? user.numTasks : 0); };
    };
    UserFilter.tasksRemainingFn = function (num) {
        if (isNaN(num)) {
            return function (x) { return false; };
        }
        return function (user) { return num <= user.numTasks - user.numCompletedTasks; };
    };
    // Returns a predicate that matches arbitrary text within the user record
    UserFilter.textMatchFn = function (text) {
        // This is very silly!
        return function (user) {
            return JSON.stringify(user).toLowerCase().indexOf(text.toLowerCase()) != -1;
        };
    };
    // Parses a timestamp from the given text like "2022/04/05", or returns NaN if it's invalid.
    UserFilter.parseDate = function (text) {
        if (!/^[21][0-9][0-9][0-9]\/[0123][0-9]\/[0-9][0-9]$/.test(text)) {
            return Number.NaN;
        }
        var tzOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
        var parts = text.split("/");
        var timestamp = Date.parse("".concat(parts[0], "-").concat(parts[1], "-").concat(parts[2], "T00:00:00.000Z"));
        return timestamp + tzOffsetMs;
    };
    // Yields a sequence of space-separated tokens from the given string.
    // Double quotes with backslash escapes can be used to create tokens with spaces.
    UserFilter.tokenize = function (text) {
        var start, pos, inToken, inQuote, len, nextQuote, nextEscape, nextSpace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = text.replace(/\s/g, " ").trim();
                    start = 0;
                    pos = 0;
                    inToken = false;
                    inQuote = false;
                    len = text.length;
                    _a.label = 1;
                case 1:
                    if (!(start < len)) return [3 /*break*/, 9];
                    nextQuote = UserFilter.nextPos(text, "\"", pos);
                    nextEscape = UserFilter.nextPos(text, '\\"', pos);
                    nextSpace = UserFilter.nextPos(text, " ", pos);
                    if (!(inQuote && nextEscape < nextQuote - 1)) return [3 /*break*/, 2];
                    // Continue the current quote token past the next escaped quote
                    pos = nextEscape + 2;
                    return [3 /*break*/, 8];
                case 2:
                    if (!(inQuote && nextQuote < nextEscape)) return [3 /*break*/, 4];
                    // This quoted token ends with the next quote
                    return [4 /*yield*/, text.substring(start, nextQuote).replace(/\\"/g, "\"")];
                case 3:
                    // This quoted token ends with the next quote
                    _a.sent();
                    start = nextQuote + 1;
                    pos = start;
                    inToken = false;
                    inQuote = false;
                    return [3 /*break*/, 8];
                case 4:
                    if (!(inToken && nextEscape < nextSpace)) return [3 /*break*/, 5];
                    // Continue the current plain token past the next escaped quote
                    pos = nextEscape + 2;
                    return [3 /*break*/, 8];
                case 5:
                    if (!inToken) return [3 /*break*/, 7];
                    // This token ends with the next space, or the end of the string
                    return [4 /*yield*/, text.substring(start, nextSpace).replace(/\\"/g, "\"")];
                case 6:
                    // This token ends with the next space, or the end of the string
                    _a.sent();
                    start = nextSpace + 1;
                    pos = start;
                    inToken = false;
                    inQuote = false;
                    return [3 /*break*/, 8];
                case 7:
                    if (!inToken && nextQuote < nextSpace && nextQuote < nextEscape) {
                        // The next token starts with a quote
                        inQuote = true;
                        inToken = true;
                        start = nextQuote + 1;
                        pos = start;
                    }
                    else if (!inToken && pos == nextSpace) {
                        // Wind past the spaces to the start of the next token
                        while (pos < len && text[pos] == " ")
                            pos++;
                    }
                    else {
                        // The next token is non-quoted and starts here
                        start = pos;
                        inToken = true;
                    }
                    _a.label = 8;
                case 8: return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    };
    // Like string.indexOf but returns the end position of the string if not found, rather than -1.
    UserFilter.nextPos = function (text, substring, pos) {
        var index = text.indexOf(substring, pos);
        return index == -1 ? text.length : index;
    };
    return UserFilter;
}());
export { UserFilter };
//# sourceMappingURL=userfilter.js.map