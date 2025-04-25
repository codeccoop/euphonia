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
import { EN_STRINGS } from "./strings_en";
import { ES_STRINGS } from "./strings_es";
import { FR_STRINGS } from "./strings_fr";
import { HI_STRINGS } from "./strings_hi";
import { JA_STRINGS } from "./strings_ja";
// Describes all localizations
export var LOCALIZED_STRINGS = new Map([
    ["en-US", toLocaleTable(EN_STRINGS)],
    ["en-GB", toLocaleTable(EN_STRINGS)],
    ["es-ES", toLocaleTable(ES_STRINGS)],
    ["fr-FR", toLocaleTable(FR_STRINGS)],
    ["hi-HI", toLocaleTable(HI_STRINGS)],
    ["ja-JP", toLocaleTable(JA_STRINGS)],
]);
// Builds a map of the translated strings for a given language.
function toLocaleTable(translations) {
    var e_1, _a;
    var result = new Map();
    try {
        for (var translations_1 = __values(translations), translations_1_1 = translations_1.next(); !translations_1_1.done; translations_1_1 = translations_1.next()) {
            var s = translations_1_1.value;
            var key = lkey(s.key);
            if (result.has(key)) {
                throw new Error("Key already defined for language: ".concat(key));
            }
            result.set(key, s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (translations_1_1 && !translations_1_1.done && (_a = translations_1.return)) _a.call(translations_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
// Normalizes case and whitespace for the purposes of localization key lookup.
function lkey(s) {
    return s.replace(/\s+/g, " ").trim().toLowerCase();
}
// Localizes the given string into the given language, substituting arguments
// in the given format string as needed. Substitution proceeds by inserting any values
// from the given key/value list into the format string into matching values denoted by
// curly braces. There is no escape sequence; if text enclosed in any number of curly braces
// have no exact match to a supplied argument in the map, they are left as-is.
export function formatWithArgs(lang, formatString) {
    var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
    var argsList = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        argsList[_i - 2] = arguments[_i];
    }
    if (formatString.trim() == "") {
        return formatString; // ignore blanks
    }
    // Target the current language if there is a translation.
    var langMap = LOCALIZED_STRINGS.get(lang);
    var localizedString = langMap ? langMap.get(lkey(formatString)) : undefined;
    if (!langMap || !localizedString) {
        console.log("Warning: no localization in lang[".concat(lang, "]:\n").concat(formatString, "\n==============="));
        console.log(new Error().stack);
    }
    else {
        formatString = localizedString.text;
    }
    // Also localize the argument values, if relevant
    var args = new Map();
    for (var i = 0; i < argsList.length; i += 2) {
        var key = argsList[i];
        var value = argsList[i + 1];
        var localizedValue = langMap ? langMap.get(lkey(value)) : null;
        args.set(key, localizedValue ? localizedValue.text : value);
    }
    if (formatString.indexOf("{") === -1) {
        if (args && args.size > 0) {
            throw new Error("Arguments supplied to non-parameterized format string: ".concat(formatString));
        }
        return formatString; // simple case: no arguments needed
    }
    try {
        // Error check argument strings
        for (var _e = __values(args.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var arg = _f.value;
            if (arg.indexOf("}") != -1) {
                throw new Error("Invalid format argument: ".concat(arg));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var found = new Set();
    var isFirst = true;
    var result = "";
    try {
        for (var _g = __values(formatString.split(/\{/)), _h = _g.next(); !_h.done; _h = _g.next()) {
            var part = _h.value;
            var isSub = false;
            try {
                for (var _j = (e_4 = void 0, __values(args.keys())), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var arg = _k.value;
                    var sub = "".concat(arg, "}");
                    if (part.startsWith(sub)) {
                        result += args.get(arg);
                        result += part.substring(sub.length);
                        found.add(arg);
                        isSub = true;
                        break;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (!isSub) {
                // No matching argument was found, so leave this unsubstituted
                if (!isFirst) {
                    result += "{";
                }
                isFirst = false;
                result += part;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
        }
        finally { if (e_3) throw e_3.error; }
    }
    try {
        for (var _l = __values(args.keys()), _m = _l.next(); !_m.done; _m = _l.next()) {
            var arg = _m.value;
            if (!found.has(arg)) {
                throw new Error("Unused argument: ".concat(arg));
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return result;
}
//# sourceMappingURL=localization.js.map