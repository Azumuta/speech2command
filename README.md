# speech2command

Tool to convert sproken commands to actual commands in Azumuta. Using Kaldi ASR models and Vosk-API.

## Usage

VoskJS.js defines a recognizer for the model and should be loaoded first.
resultHandling converts the model to actual commands. Commands can be added with `addToCommand(text, command)`, where `command` is the command for Azumuta and text is a list with words (defined in red<LANG>.js).
To load the English model, load redEn.js; this will load the model and define the appropriate words. To use Dutch, load redNl.js instead.