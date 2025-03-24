#!/usr/local/bin/node

// This is a silly little utility that helps deploy.sh by parsing deploy_test/prod.json.

const fs = require("fs");

// The template files and their outputs
const TEMPLATES = {
  "./templates/firebase.json": "./firebase.json",
  "./templates/.firebaserc": ".firebaserc",
  "./templates/firebaseconfig.web.ts": "src/firebaseconfig.ts",
  "./templates/firebaseconfig.functions.ts": "functions/src/firebaseconfig.ts",
};

// The variables we parse from the deploy_blah.json file
const VARS = [
  "__AUDIOTOOL_FIREBASE_API_KEY__",
  "__AUDIOTOOL_FIREBASE_AUTH_DOMAIN__",
  "__AUDIOTOOL_FIREBASE_DATABASE_URL__",
  "__AUDIOTOOL_FIREBASE_PROJECT_ID__",
  "__AUDIOTOOL_FIREBASE_STORAGE_BUCKET__",
  "__AUDIOTOOL_FIREBASE_PROJECT_NUMBER__",
  "__AUDIOTOOL_FIREBASE_HOST__",
  "__AUDIOTOOL_FIREBASE_STORAGE_RECORDING_PATH__",
  "__AUDIOTOOL_FIREBASE_STORAGE_CONSENTS_PATH__",
  "__AUDIOTOOL_FIREBASE_STORAGE_IMAGETASKS_PATH__",
  "__AUDIOTOOL_ADMIN_EMAILS_LIST__",
];

class VarParser {
  constructor(args) {
    this.args = args;
  }

  // Parses which command is wanted
  run() {
    if (this.args.length < 2) {
      console.log('Expected a command; try "gentemplate" or "printvar"');
      return 1;
    } else if (this.args[2] == "gentemplate") {
      if (this.args.length != 4) {
        console.log('Expected an env name, like "deployvars gentemplate prod"');
        return 1;
      }

      const vars = this.parseVars_(this.args[3]);
      if (typeof vars !== "object") {
        return 1;
      }

      this.generateTemplates_(vars);
    } else if (this.args[2] == "printvar") {
      if (this.args.length != 5) {
        console.log(
          'Expected env and variable names, like "deployvars printvar prod __AUDIOTOOL_FIREBASE_PROJECT_ID__"',
        );

        return 1;
      }

      const varname = this.args[4];

      const vars = this.parseVars_(this.args[3]);
      if (typeof vars !== "object") {
        return 1;
      }

      if (!vars[varname]) {
        console.log(`No value for variable: ${varname}`);
        return 1;
      }

      console.log(vars[varname]);
    } else {
      console.log('Unkown command; try "gentemplate" or "printvar"');
      return 1;
    }
  }

  // Returns the deplay variables from the given environment.
  parseVars_(envname) {
    const varFilename = `deploy/${envname}.json`;
    if (!fs.existsSync(varFilename) || !fs.statSync(varFilename).isFile()) {
      console.log(`Unkown environment "${envname}"`);
      return;
    }

    return JSON.parse(fs.readFileSync(varFilename));
  }

  generateTemplates_(vars) {
    for (const infile in TEMPLATES) {
      const outfile = TEMPLATES[infile];
      let templateText = fs.readFileSync(infile, {
        encoding: "utf8",
        flag: "r",
      });

      for (const varName of VARS) {
        templateText = this.replaceVar(templateText, varName, vars[varName]);
      }

      fs.writeFileSync(outfile, templateText);
    }
  }

  // Replaces all occurrences of the variable with the desired string value.
  replaceVar(text, varName, value) {
    value = this.getSubValue(varName, value);

    let result = "";
    let pos = 0;
    let m = text.indexOf(varName);
    while (m != -1 && pos < text.length) {
      result += text.substring(pos, m);
      result += value;
      pos = m + varName.length;
      m = text.indexOf(varName, pos);
    }

    result += text.substring(pos);
    return result;
  }

  // Returns the string to substitute for this variable.
  getSubValue(varName, value) {
    if (varName == "__AUDIOTOOL_ADMIN_EMAILS_LIST__") {
      // This one is special, treat it like a list of quoted strings.
      if (!value || value.length == 0) {
        return "";
      } else {
        return `"${value.join('", "')}"`;
      }
    }

    if (value == undefined) {
      return "";
    }

    return `${value}`;
  }
}

// Go
const p = new VarParser(process.argv);
const result = p.run();
process.exit(result);
