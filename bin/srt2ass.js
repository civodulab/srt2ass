#! /usr/bin/env node

'use strict';
const fs = require('fs');
const subtitle = require('subtitle');
const monLog=require('../src/monLog');
var optionator = require('../help/options');
var mesFunctions=require('../src/functions');
var options = optionator.parseArgv(process.argv);
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

let ass_config = require('../src/ass.config.default.json');
// récupère le fichier de config s'il existe
if (fs.existsSync('./.srt2assrc')) {
    ass_config = JSON.parse(fs.readFileSync('./.srt2assrc', 'utf8'));
}

// ajoute les lignes dans txt_tab
let txt_tab = [];
txt_tab.push('[Script Info]');
for (let [key, value] of Object.entries(ass_config.scriptInfo)) {
    key = (key !== 'intro') && (key + ': ') || '';
    txt_tab.push(key + value);
}
txt_tab.push('');
txt_tab.push('[V4+ Styles]');
txt_tab.push("Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding");

const styles = ass_config.v4Styles;

Object.values(styles).forEach(style => {
    txt_tab.push(mesFunctions.writeLigne(style));
});
txt_tab.push('');
txt_tab.push('[Events]');
txt_tab.push('Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text');


const data = fs.readFileSync(argv.file_in, 'utf8');
const parse = subtitle.parse(data);
Object.values(parse).forEach(s => {
    let start = mesFunctions.timeASS(subtitle.toVttTime(s.start));
    let end = mesFunctions.timeASS(subtitle.toVttTime(s.end));
    let text = s.text.replace('<br />', '\\N');
    txt_tab.push("Dialogue: 0," + start + "," + end + "," + ass_config.optionsDialogues.defaultStyle + ",,0,0,0,," + text);
});

fs.writeFileSync(argv.file_out, txt_tab.join('\n'));
monLog.log('srt2ass', argv.file_out, 'généré');