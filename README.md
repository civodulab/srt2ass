# srt2ass

srt2ass est un outil permettant de transformer un document srt (SubRip) en ass (Advanced Sub Station).

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.14), npm version 3+.

### Local Installation and Usage

```
$ npm install srt2ass
```

### Global Installation and Usage

```
$ npm install -g srt2ass
```

Utilisation :

```
$ srt2ass file_in.srt [file_out.ass]
```

file_out optionnel. S'il n'exite pas il prendra le même nom que file_in.

## Configuration

Si vous voulez paramétrer le fichier ass, créer le fichier `.srt2assrc` à la racine du répertoire avec les paramètres suivants :

```json
{
    "scriptInfo": {
        "intro": "This is an Advanced Sub Station Alpha v4 , script.",
        "Title": "untitled",
        "ScriptType": "v4.00+",
        "Collisions": "Normal",
        "PlayDepth": 0,
        "PlayResX": "",
        "PlayResY": "",
        "WrapStyle": 2,
        "ScaledBorderAndShadow": "No"
    },
    "v4Styles": [
         {
            "Format": "Style",
            "Name": "Default",
            "Fontname": "Arial",
            "Fontsize": 20,
            "PrimaryColour": "&H00FFFFFF",
            "SecondaryColour": "&H0300FFFF",
            "OutlineColour": "&H00000000",
            "BackColour": "&H02000000",
            "Bold": 0,
            "Italic": 0,
            "Underline": 0,
            "StrikeOut": 0,
            "ScaleX": 100,
            "ScaleY": 100,
            "Spacing": 0,
            "Angle": 0,
            "BorderStyle": 1,
            "Outline": 2,
            "Shadow": 1,
            "Alignment": 2,
            "MarginL": 10,
            "MarginR": 10,
            "MarginV": 10,
            "Encoding": 1
        }
    ],
    "optionsDialogues":{
        "defaultStyle": "Default"
    }
}
```

Vous pouvez ajouter autant de style que vous voulez dans `v4Style`