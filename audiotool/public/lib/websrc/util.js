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
define([
  "require",
  "exports",
  "../commonsrc/localization",
  "../commonsrc/schema",
], function (require, exports, localization_1, schema_1) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Swiper =
    exports.Dropdown =
    exports.Spinner =
    exports.isIOS =
    exports.errorToast =
    exports.toast =
    exports.postAsJson =
    exports.isSafari =
    exports.authenticatedFetch =
    exports.toURL =
    exports.animateCss =
    exports.fadeOut =
    exports.fadeIn =
    exports.animateOpacity =
    exports.fork =
    exports.sleepFrame =
    exports.sleep =
    exports.setDisplayLanguage =
      void 0;
  // Some simply JQuery conveniences
  $.fn.eadd = function (spec) {
    const newChild = $(spec);
    this.append(newChild);
    return newChild;
  };
  $.fn.eins = function (spec) {
    const newChild = $(spec);
    this.prepend(newChild);
    return newChild;
  };
  // Sets the text contents of this node and returns it
  $.fn.etext = function (text) {
    this.text(text);
    return this;
  };
  // Sets the HTML contents of this node and returns it
  $.fn.ehtml = function (text) {
    this.html(text);
    return this;
  };
  // Sets the textual value of this input node and returns it
  $.fn.evalue = function (text) {
    this.val(text);
    return this;
  };
  $.fn.eshow = function (show) {
    if (show) {
      this.show();
    } else {
      this.hide();
    }
  };
  $.fn.evisible = function (show) {
    if (show) {
      this.css("opacity", "1");
    } else {
      this.css("opacity", "0");
    }
  };
  $.fn.eenable = function (enabled) {
    this.prop("disabled", !enabled);
  };
  $.fn.echecked = function (isChecked) {
    this.prop("checked", isChecked);
  };
  $.fn.eclass = function (className, wanted) {
    if (!className) {
      return;
    }
    if (wanted) {
      this.addClass(className);
    } else {
      this.removeClass(className);
    }
  };
  $.fn.efade = async function (show) {
    if (show) {
      this.show();
      await fadeIn(this);
    } else {
      await fadeOut(this);
      this.hide();
    }
  };
  // Adds a row to a table.
  $.fn.eaddtr = function (cellNodes, rowClass) {
    const tr = this.eadd("<tr />");
    const result = [];
    tr.eclass(rowClass, !!rowClass);
    for (const cell of cellNodes) {
      const td = tr.eadd("<td />");
      td.append(cell);
      result.push(cell);
    }
    return result;
  };
  // The user's selected language, from their profile or from the URL.
  let CURRENT_LANGUAGE = "en-US";
  function setDisplayLanguage(lang) {
    if (schema_1.SUPPORTED_LANGUAGES.has(lang)) {
      CURRENT_LANGUAGE = lang;
    }
  }
  exports.setDisplayLanguage = setDisplayLanguage;
  $.fn.eitext = function (formatString, ...args) {
    return this.etext(
      (0, localization_1.formatWithArgs)(
        CURRENT_LANGUAGE,
        formatString,
        ...args
      )
    );
  };
  $.fn.eihtml = function (formatString, ...args) {
    return this.ehtml(
      (0, localization_1.formatWithArgs)(
        CURRENT_LANGUAGE,
        formatString,
        ...args
      )
    );
  };
  $.fn.eiprop = function (propertyName, formatString, ...args) {
    this.prop(
      propertyName,
      (0, localization_1.formatWithArgs)(
        CURRENT_LANGUAGE,
        formatString,
        ...args
      )
    );
    return this;
  };
  // Awaitable sleep function.
  function sleep(ms) {
    if (ms < 0) {
      return;
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  exports.sleep = sleep;
  // Awaits the browser's next animation frame.
  function sleepFrame() {
    return new Promise(requestAnimationFrame);
  }
  exports.sleepFrame = sleepFrame;
  // Runs an async function next time the event loop finishes; does not await it.
  function fork(fn) {
    setTimeout(fn, 1);
  }
  exports.fork = fork;
  // Eases an opacity change one div over time.
  async function animateOpacity(div, start, end, opt_speed) {
    if (!opt_speed) {
      opt_speed = 0.3;
    }
    div.css("opacity", `${start}`);
    await sleep(100);
    div.css("transition", `opacity ease-in ${opt_speed}s`);
    div.css("opacity", `${end}`);
    await sleep(Math.round(opt_speed * 1000));
    div.css("transition", "");
  }
  exports.animateOpacity = animateOpacity;
  async function fadeIn(div, opt_speed) {
    await animateOpacity(div, 0, 1, opt_speed);
  }
  exports.fadeIn = fadeIn;
  async function fadeOut(div, opt_speed) {
    await animateOpacity(div, 1, 0, opt_speed);
  }
  exports.fadeOut = fadeOut;
  // Eases a background color change over time.
  async function animateCss(div, fromClass, toClass, opt_speed) {
    if (!opt_speed) {
      opt_speed = 0.3;
    }
    div.addClass(fromClass);
    await sleep(100);
    div.addClass(toClass);
    await sleep(Math.round(opt_speed * 1000));
    div.removeClass(fromClass);
    div.removeClass(toClass);
  }
  exports.animateCss = animateCss;
  function toURL(path, opt_args) {
    const url = new URL(window.location.origin + path);
    if (opt_args) {
      for (const k in opt_args) {
        url.searchParams.append(k, opt_args[k]);
      }
    }
    return url;
  }
  exports.toURL = toURL;
  // Performs a network fetch to the server, providing the signed-in user's token, with 1 auth-related retry. Throws an exception on non-200 responses.
  async function authenticatedFetch(
    path,
    opt_args,
    opt_method,
    opt_rawBody,
    retries = 1
  ) {
    const method = opt_method == null ? "get" : opt_method;
    const args = opt_args == null ? {} : opt_args;
    const options = { method, credentials: "include" };
    const url = toURL(path, args);
    if (opt_rawBody) {
      const headers = new Headers();
      headers.append("Content-Type", "application/octet-stream");
      options.headers = headers;
      options.body = opt_rawBody;
    }
    let triesLeft = retries;
    while (true) {
      triesLeft--;
      const token = await firebase.auth().currentUser.getIdToken();
      document.cookie = "__session=" + token + ";max-age=3600;path=/";
      console.log(document.cookie);
      const rsp = await fetch(url.toString(), options);
      if (rsp.ok) {
        return rsp;
      } else if (0 < triesLeft && (rsp.status === 401 || rsp.status === 403)) {
        continue; // try again; the failed response will cause a cookie refresh
      } else {
        // The server will usually give application errors in JSON format
        const contentType = rsp.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const message = await rsp.json();
          throw new Error(message[0]);
        } else {
          // Otherwise just report a generic error
          throw new Error("Error during request");
        }
      }
    }
  }
  exports.authenticatedFetch = authenticatedFetch;
  // Returns true if the current browser is Safari.
  function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
  exports.isSafari = isSafari;
  // Same as above, but POSTs a JSON body and receives JSON blob, which it parses.
  async function postAsJson(path, jsonObj) {
    const body = new TextEncoder().encode(JSON.stringify(jsonObj));
    const rsp = await authenticatedFetch(path, {}, "post", body);
    return await rsp.json();
  }
  exports.postAsJson = postAsJson;
  // Shows a fire-and-forget floating message to the user.
  function toast(message, duration = 1000, cssClasses = "toast") {
    setTimeout(async (x) => {
      const div = $("BODY").eins(`<div class="${cssClasses}" />`);
      div.text(message);
      await fadeIn(div);
      await sleep(duration);
      await fadeOut(div);
      div.remove();
    }, 1);
  }
  exports.toast = toast;
  function errorToast(message) {
    toast(message, 3000, "toast errortoast");
  }
  exports.errorToast = errorToast;
  function isIOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    ); // iPad on iOS 13 detection
  }
  exports.isIOS = isIOS;
  // Blocks out the UI with a global modal spinner
  class Spinner {
    constructor() {
      this.waiters = 0;
      this.overlay = $("BODY").eadd("<div class=spinneroverlay />");
      this.div = this.overlay.eadd(`<div class=spinner />`);
    }
    static async waitFor(fn) {
      if (!Spinner.self) {
        Spinner.self = new Spinner();
      }
      Spinner.self.waiters++;
      try {
        return await fn();
      } finally {
        Spinner.self.waiters--;
        if (Spinner.self.waiters <= 0) {
          // Last waiter out removes the current spinner
          Spinner.self.remove();
          Spinner.self = undefined;
        }
      }
    }
    remove() {
      this.overlay.remove();
      this.overlay = undefined;
      this.div = undefined;
    }
  }
  exports.Spinner = Spinner;
  // Simple manager class for an HTML5 dropdown
  class Dropdown {
    constructor(parent, cssClass) {
      this.options = [];
      this.select = parent.eadd(
        `<select class="${cssClass ? cssClass : ""}" />`
      );
    }
    addOption(value, label) {
      const option = this.select.eadd("<option />");
      this.options.push(option);
      option.text(label);
      option.val(value);
      return option;
    }
    // Returns the value of the selected option.
    getSelected() {
      for (const option of this.options) {
        if (option.is(":selected")) {
          return `${option.val()}`;
        }
      }
      return undefined;
    }
    onchange(fn) {
      this.select.on("change", fn);
    }
  }
  exports.Dropdown = Dropdown;
  // Simple class that notifies listeners of swipe directions
  class Swiper {
    constructor(div, callback) {
      this.div = div;
      this.callback = callback;
      this.fn = this.handleTouch.bind(this);
      this.div.get(0).addEventListener("touchstart", this.fn);
      this.div.get(0).addEventListener("touchmove", this.fn);
      this.div.get(0).addEventListener("touchend", this.fn);
    }
    remove() {
      this.div.get(0).removeEventListener("touchstart", this.fn);
      this.div.get(0).removeEventListener("touchmove", this.fn);
      this.div.get(0).removeEventListener("touchend", this.fn);
    }
    async handleTouch(e) {
      let x, y;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches.item(i);
        x = touch.screenX;
        y = touch.screenY;
        break;
      }
      if (e.type === "touchstart" && x != undefined) {
        this.startX = x;
        this.startY = y;
        this.lastX = x;
        this.lastY = y;
      } else if (e.type === "touchmove" && x != undefined) {
        this.lastX = x;
        this.lastY = y;
      } else if (
        e.type === "touchend" &&
        this.startX != undefined &&
        this.startY != undefined &&
        this.lastX != undefined &&
        this.lastY != undefined
      ) {
        // Dispatch touch event
        const dx = this.lastX - this.startX;
        const dy = this.lastY - this.startY;
        if (Math.abs(dx) > Math.abs(dy)) {
          await this.callback(dx < 0 ? "left" : "right");
        } else {
          await this.callback(dy < 0 ? "up" : "down");
        }
      }
    }
  }
  exports.Swiper = Swiper;
});
//# sourceMappingURL=util.js.map
