#! /usr/bin/env node

"use strict";
const fs = require("fs");
const subtitle = require("subtitle");
const monLog = require("../src/monLog");
const optionator = require("../help/options");
const mesFunctions = require("../src/functions");
// const options = optionator.parseArgv(process.argv);
let options;
try {
   options = optionator.parseArgv(process.argv);
} catch (error) {
  console.log("erreur");
  console.log(optionator.generateHelp());

  return;
}

if (options.init) {
  mesFunctions.init(options.init);
  return;
}

if (options.help) {
  console.log(optionator.generateHelp());
  return;
}
if (options.version) {
  console.info(`v${require("../package.json").version}`);
  return;
}
const argv = mesFunctions.recupProcessArgv(options);
if (argv.erreur) {
  console.log(optionator.generateHelp());
  return;
}

// ajoute les lignes dans txt_tab
let txt_tab = [];
txt_tab.push("[Script Info]");
for (let [key, value] of Object.entries(mesFunctions.options().scriptInfo)) {
  txt_tab.push(key + ": " + value);
}
txt_tab.push("");
txt_tab.push("[V4+ Styles]");
txt_tab.push(
  "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding"
);

const styles = mesFunctions.options().v4Styles;

Object.values(styles).forEach(style => {
  txt_tab.push(mesFunctions.writeLigne(style));
});
txt_tab.push("");
txt_tab.push("[Events]");
txt_tab.push(
  "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
);

const data = fs.readFileSync(argv.file_in, "utf8");
const parse = subtitle.parse(data);
Object.values(parse).forEach(s => {
  let start = mesFunctions.timeASS(subtitle.toVttTime(s.start));
  let end = mesFunctions.timeASS(subtitle.toVttTime(s.end));
  let text = s.text.replace("<br />", "\\N");
  txt_tab.push(
    "Dialogue: 0," +
      start +
      "," +
      end +
      "," +
      mesFunctions.options().optionsDialogues.defaultStyle +
      ",,0,0,0,," +
      text
  );
});

fs.writeFileSync(argv.file_out, txt_tab.join("\n"));
monLog.log("srt2ass", argv.file_out, "généré");
