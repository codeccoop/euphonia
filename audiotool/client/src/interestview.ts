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

import { Data } from "./data";
import { App } from "./app";
import { UserDemographics } from "../../common/schema";
import { listhas } from "../../common/util";

// TODO: Negotate demographic contents
// Implements the Interest form experience.
export class InterestView {
  app: App;
  data: Data;
  div: JQuery<HTMLElement>;

  constructor(app: App) {
    this.app = app;
    this.data = app.data;
    this.div = app.main.eadd("<div id=interestform />");
    this.div.hide();

    const insetBox = this.div.eadd("<div class=interestformscroll />");
    insetBox.eihtml("__INTEREST_FORM_HTML__");
    $("#helpersection").hide();

    // Helper box conditional wiring
    const helperchangefn = () =>
      $("#helpersection").eshow($("#ifhelperyes").is(":checked"));

    $("#ifhelperyes").on("change", helperchangefn);
    $("#ifhelperno").on("change", helperchangefn);

    const buttons = insetBox.eadd("<div class=ifbuttons />");
    const nextButton = buttons.eadd("<button class=next />").eitext("Next");
    const backButton = buttons.eadd("<button />").eitext("Go Back");
    const clearButton = buttons
      .eadd("<button />")
      .eitext("Reset form and start over");
    backButton.on("click", async (e) => {
      const d = this.collect();
      this.data.saveDemographics(d);
      await this.app.navigateTo("/enroll");
    });
    nextButton.on("click", async (e) => {
      // Go to the consent page if the user's form inputs are valid
      if (await this.save()) {
        await this.app.navigateTo("/consent");
      }
    });
    clearButton.on("click", async (e) => this.clear());
  }

  // Hides or shows the whole display
  async eshow(show: boolean): Promise<void> {
    this.div.eshow(show);
    if (!show) {
      return; // Don't need any other GUI changes for now
    }

    if (show && this.data.user) {
      this.app.showMessage("You have already completed this form.");
    }

    // Populate the interest form with any saved choices the user made
    this.fill(this.data.loadDemographics());
  }

  // Unused
  async handleUpdate() {}

  // Returns true if the user's inputs were all valid; otherwise toasts and returns false.
  async save(): Promise<boolean> {
    // Save their answers so they can come back, even if they're not right.
    const d = this.collect();
    this.data.saveDemographics(d);

    // Validate required fields
    try {
      this.checkRequired(
        "#helperbox",
        "Si us plau, respon a la pregunta sobre la persona acompanyant.",
        d.hasHelper != undefined,
      );
      this.checkRequired(
        "#ifassistantemail",
        "Si us plau, indica'ns l'adreça de correu electrònic de la persona que t'acompanya.",
        !d.hasHelper || !!d.helperEmail,
      );
      this.checkRequired(
        "#ifprovince",
        "Si us plau, respon a la pregunta sobre la província.",
        !!d.province,
      );
      this.checkRequired(
        "#ifdialect",
        "Si us plau, respon a la pregunta sobre la varietat dialectal.",
        !!d.dialect,
      );
      this.checkRequired(
        "#ifdisorder",
        "Si us plau, respon a la pregunta sobre la tipologia de trastorn.",
        !!d.disorder,
      );
      // this.checkRequired("#ifgender", "Aquesta pregunta és obligatòria.", !!d.gender);
      this.checkRequired(
        "#ifage",
        "Si us plau, respon a la pregunta sobre l'edat.",
        !!d.age,
      );
      this.checkRequired(
        "#ifformconsent",
        `You'll need to give consent to proceed.`,
        !!d.consentStorage,
      );
      this.checkRequired(
        "#ifconsentinitials",
        `Please write your initials next to your consent.`,
        !!d.consentInitials,
      );
      // this.checkRequired(
      //   "#ifformtos",
      //   `You'll need to accept the terms to proceed.`,
      //   !!d.acceptTos,
      // );
    } catch (e) {
      if (e instanceof Error && e.message === "form incomplete") {
        return false;
      } else {
        throw e;
      }
    }

    return true;
  }

  // Erases saved demographics and clears the form.
  clear() {
    // Overwrite all saved data and clear all form elements
    this.data.saveDemographics({});
    this.fill({});
  }

  // Focuses and styles the given selector with an error class if the given condition is false.
  private checkRequired(selector: string, message: string, check: boolean) {
    const elem = $(selector);
    elem.eclass("formerror", !check);
    if (!check) {
      this.app.showMessage(message, "error");
      if (elem.get(0)) {
        elem.get(0)!.scrollIntoView();
      }
      elem.focus();
      throw new Error("form incomplete");
    }
  }

  // Fills the form elements with the given pre-existing demographics struct
  private fill(d: UserDemographics) {
    const setText = (id: string, t: string | undefined) =>
      $(id).val(t ? t : "");
    const setBool = (id: string, val: boolean) => $(id).echecked(val);

    // Clear error states
    $("#ifprovince").eclass("formerror", false);
    // $("#ifstate").eclass("formerror", false);
    $("#helperbox").eclass("formerror", false);
    $("#ifassistantemail").eclass("formerror", false);
    $("#ifformconsent").eclass("formerror", false);
    $("#ifconsentinitials").eclass("formerror", false);
    // $("#ifformtos").eclass("formerror", false);

    // Identity and simple text demographic fields
    setText("#ifname", d.name);
    // setText("#ifcountry", d.country);
    // setText("#ifstate", d.state);
    setText("#ifprovince", d.province);
    setText("#ifcity", d.city);
    setText("#ifdialect", d.dialect);
    // setText("#ifrace", d.race);
    setText("#ifassistantname", d.helperName);
    setText("#ifassistantemail", d.helperEmail);
    // setText("#ifassistantrelationship", d.helperRelationship);
    setText("#ifotherinfo", d.otherInfo);

    // Optional state field
    // $("#usstatebox").eshow(d.country === "USA");
    setBool("#ifdownsyndrome", d.disorder === "Síndrome de Down");
    setBool("#ifcerebralpalsy", d.disorder === "Paràlisi cerebral");
    setBool("#ifmultiplesclerosis", d.disorder === "Esclerosi múltiple");
    setBool("#ifotherdisorders", d.disorder === "Altres trastorns de la parla");
    setBool("#ifnodisorder", d.disorder === "Sense resposta");

    // Gender radio buttons
    setBool("#ifgenderfemale", "Dona" === d.gender);
    setBool("#ifgendermale", "Home" === d.gender);
    setBool("#ifgenderno", "No binari" === d.gender);
    setBool("ifgendernoresponse", "Sense resposta" === d.gender);

    if (d.gender && !listhas(d.gender, "Home", "Dona", "No binari")) {
      setBool("#ifgenderother", true);
      setText("#ifgenderothertext", d.gender);
    } else {
      setBool("#ifgenderother", false);
    }

    // Age radio buttons
    setBool("#ifage1830", "18-30" === d.age);
    setBool("#ifage3145", "31-45" === d.age);
    setBool("#ifage4660", "46-60" === d.age);
    setBool("#ifage6175", "61-75" === d.age);
    setBool("#ifage75", "+75" === d.age);

    // List of devices they have access to
    const deviceList = d.accessDevices ? d.accessDevices : [];
    setBool("#ifdevicecomputer", listhas("computer", ...deviceList));
    setBool("#ifdeviceandroid", listhas("androidphone", ...deviceList));
    setBool("#ifdeviceiphone", listhas("iphone", ...deviceList));
    setBool("#ifdevicenone", listhas("none", ...deviceList));
    setBool("#ifdeviceother", false);
    setText("#ifdeviceothertext", "");
    for (const device of deviceList) {
      if (!listhas(device, "computer", "androidphone", "iphone", "none", "")) {
        setBool("#ifdeviceother", true);
        setText("#ifdeviceothertext", device);
        break;
      }
    }

    // List of referrals
    const referralsList = d.referral ? d.referral : [];
    setBool(
      "#ifreferralentity",
      listhas("Entitat col·laboradora", ...referralsList),
    );
    setBool(
      "#ifreferralmedia",
      listhas("Mitjans de comunicació / XXSS", ...referralsList),
    );
    setBool("#ifreferralfriends", listhas("Familiar o amic", ...referralsList));
    for (const referral of referralsList) {
      if (
        !listhas(
          referral,
          "Entitat col·laboradora",
          "Mitjans de comunicació / XXSS",
          "Familiar o amic",
        )
      ) {
        setBool("#ifreferralother", true);
        setText("#ifreferralothertext", referral);
        break;
      }
    }

    // Helper radio button, which should also toggle the helper panel
    setBool("#ifhelperno", d.hasHelper === false);
    setBool("#ifhelperyes", d.hasHelper === true);
    $("#helpersection").eshow(!!d.hasHelper);

    // Never restore the consent stuff, always require it be re-entered
    $("#ifformconsent").echecked(false);
    // $("#ifformtos").echecked(false);
    setText("#ifconsentinitials", "");

    // Auto-set defaults from Firestore Auth if the user hasn't entered anything
    const fbu = this.data.fbuser;
    if ($("#ifname").val() === "" && fbu && fbu.displayName) {
      $("#ifname").val(fbu.displayName);
    }
  }

  // Gathers all of the user's responses, valid or otherwise into a struct.
  private collect(): UserDemographics {
    return {
      name: this.collectText("#ifname"),
      province: this.collectText("#ifprovince"),
      city: this.collectText("#ifcity"),
      dialect: this.collectText("#ifdialect"),
      disorder: this.collectDisorder(),
      gender: this.collectGender(),
      age: this.collectAge(),
      referral: this.collectReferral(),
      accessDevices: this.collectAccessDevices(),
      hasHelper: this.collectCheckbox("#ifhelperyes")
        ? true
        : this.collectCheckbox("#ifhelperno")
          ? false
          : undefined,
      helperName: this.collectText("#ifassistantname"),
      helperEmail: this.collectText("#ifassistantemail"),
      consentStorage: this.collectCheckbox("#ifformconsent"),
      consentInitials: this.collectText("#ifconsentinitials"),
      // acceptTos: this.collectCheckbox("#ifformtos"),
      otherInfo: this.collectText("#ifotherinfo"),
    };
  }

  private collectText(inputId: string): string {
    const text = $(inputId).val() as string;
    if (!text) {
      return "";
    } else {
      return text.trim();
    }
  }

  private collectCheckbox(inputId: string): boolean {
    return $(inputId).is(":checked");
  }

  private collectDisorder(): string {
    if (this.collectCheckbox("#ifdownsyndrome")) {
      return "Síndrome de Down";
    } else if (this.collectCheckbox("#ifcerebralpalsy")) {
      return "Paràlisi cerebral";
    } else if (this.collectCheckbox("#ifacquireddamange")) {
      return "Danys cerebrals adquirits";
    } else if (this.collectCheckbox("#ifmultiplesclerosis")) {
      return "Esclerosi múltiple";
    } else if (this.collectCheckbox("#ifotherdisorders")) {
      return "Altres trastorns de la parla";
    } else {
      return "Sense resposta";
    }
  }

  private collectAge(): string {
    if (this.collectCheckbox("#ifage1830")) {
      return "18-30";
    } else if (this.collectCheckbox("#ifage3145")) {
      return "31-45";
    } else if (this.collectCheckbox("#ifage4660")) {
      return "46-60";
    } else if (this.collectCheckbox("#ifage6175")) {
      return "61-75";
    } else if (this.collectCheckbox("#fage75")) {
      return "+75";
    } else {
      return "";
    }
  }

  private collectGender(): string {
    const hasOther = this.collectCheckbox("#ifgenderother");
    const otherText = this.collectText("#ifgenderothertext");

    if (this.collectCheckbox("#ifgendermale")) {
      return "Home";
    } else if (this.collectCheckbox("#ifgenderfemale")) {
      return "Dona";
    } else if (this.collectCheckbox("#ifgenderno")) {
      return "No binari";
    } else if (hasOther && otherText) {
      return otherText.trim();
    } else {
      return "Sense resposta"; // unanswered or prefer not to say
    }
  }

  private collectReferral(): string[] {
    const result: string[] = [];

    if (this.collectCheckbox("#ifreferralother")) {
      const otherText = this.collectText("#ifreferralothertext");
      if (otherText) {
        result.push(otherText);
      }
    }

    if (this.collectCheckbox("#ifreferralmedia")) {
      result.push("Mitjas de comunicació / XXSS");
    }

    if (this.collectCheckbox("#ifreferralfriends")) {
      result.push("Familiar o amic");
    }

    if (this.collectCheckbox("#ifreferralentity")) {
      result.push("Entitat col·laboradora");
    }

    return result;
  }

  private collectAccessDevices(): string[] {
    const result: string[] = [];
    if (this.collectCheckbox("#ifdeviceother")) {
      const otherText = this.collectText("#ifdeviceothertext");
      if (otherText) {
        result.push(otherText);
      }
    }

    if (this.collectCheckbox("#ifdevicecomputer")) {
      result.push("computer");
    }

    if (this.collectCheckbox("#ifdeviceandroid")) {
      result.push("androidphone");
    }

    if (this.collectCheckbox("#ifdeviceiphone")) {
      result.push("iphone");
    }

    if (this.collectCheckbox("#ifdevicenone")) {
      result.push("none");
    }

    return result;
  }
}
