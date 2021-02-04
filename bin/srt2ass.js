#! /usr/bin/env node

"use strict";
const fs = require("fs");
const path = require("path");
const subtitle = require("subtitle");
const monLog = require("../src/monLog");
const optionator = require("../help/options");
const mesFunctions = require("../src/functions");
const styles = mesFunctions.options().v4Styles;
const minGapBetweenSub = mesFunctions.options().optionsDialogues.minGapBetweenSub;
const defaultStyle = mesFunctions.options().optionsDialogues.defaultStyle;

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

if (options.dir) {
  let fichierSrt = [];
  let chemin = process.cwd();
  fs.readdir(chemin, function (err, items) {
    items.forEach((f) => {
      path.extname(f) === ".srt" && fichierSrt.push(path.join(chemin, f));
    });
    if (fichierSrt.length === 0) {
      monLog.error("Vous n'avez pas de fichiers srt dans votre répertoire");
      return;
    }
    writeFiles(fichierSrt);
  });
} else {
  const argv = mesFunctions.recupProcessArgv(options);
  if (argv.erreur) {
    console.log(optionator.generateHelp());
    return;
  }
  if (fs.existsSync(argv.file_in)) {
    writeFiles([argv.file_in], argv.file_out);
  } else {
    monLog.error("Le fichier n'existe pas");
    console.log(optionator.generateHelp());
    return;
  }
}
let erreurs = [];

function writeFiles(files, file_out) {
  files.forEach((f) => {
    // ajoute les lignes dans txt_tab
    let erreursLigne = [];

    let endBefore = 0;
    let txt_tab = [];
    let out_file = (file_out && file_out) || f.split(".")[0] + ".ass";
    txt_tab.push("[Script Info]");
    for (let [key, value] of Object.entries(mesFunctions.options().scriptInfo)) {
      txt_tab.push(key + ": " + value);
    }
    txt_tab.push("");
    txt_tab.push("[V4+ Styles]");
    txt_tab.push(
      "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding"
    );

    Object.values(styles).forEach((style) => {
      txt_tab.push(mesFunctions.writeLigne(style));
    });
    txt_tab.push("");
    txt_tab.push("[Events]");
    txt_tab.push(
      "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    );

    const data = fs.readFileSync(f, "utf8");
    const parse = subtitle.parse(data);
    Object.values(parse).forEach((s, i) => {
    
      let actor = ["", ""];
      if (s.start - endBefore <= minGapBetweenSub) {
        s.start = endBefore + minGapBetweenSub;
      }
      let start = mesFunctions.timeASS(subtitle.toVttTime(s.start));
      let end = mesFunctions.timeASS(subtitle.toVttTime(s.end));
      if (!s.text) {
        s.text = "";
        erreursLigne.push(i + 1);
      }
      let text = s.text.replace(/<br \/>|\n/, "\\N");
      if (text.trim().substring(0, 1) === "[") {
        actor = text.match(/\[([^\]]+)\]/);
        text = text.replace(actor[0], "");
      }

      txt_tab.push(
        "Dialogue: 0," +
          start +
          "," +
          end +
          "," +
          defaultStyle +
          "," +
          actor[1] +
          ",0,0,0,," +
          text
      );
      endBefore = s.end;
    });
    if (erreursLigne.length!==0) {
      erreurs.push({
        Fichier: f.split("\\").pop(),
        "Erreur lignes vides": erreursLigne.join(", "),
      });
    }
    fs.writeFileSync(out_file, txt_tab.join("\n"));
    monLog.log("srt2ass", out_file, "généré");
  });
  if (erreurs.length!==0) {
    console.table(erreurs);
  }
}
