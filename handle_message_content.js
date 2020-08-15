const { commands } = require('./commands');
const { prefix } = require('./config.json');

function handleMessageContent(content) {
  const trimmedMessage = content.trimLeft();

  // check if the prefix is at the start of the message
  if (!trimmedMessage.startsWith(prefix)) {
    return undefined;
  }

  // a valid command is any non space character following the prefix
  // we also will optionally capture any of the text following the command in case
  const commandExtractRegexp = new RegExp(`${prefix}(?<commandName>\\S+)(?<contentAfterCommand>.*)?`);
  const regexpExtract = commandExtractRegexp.exec(trimmedMessage);
  if (regexpExtract === null) {
    return 'Error! Unable to understand command.';
  }

  const { commandName, contentAfterCommand } = regexpExtract.groups;

  if (!commands.has(commandName)) {
    return `Error! Unrecognized command: '${commandName}'`;
  }
  console.log(`running command ${commandName}`);
  const outputMessage = commands.get(commandName).execute(contentAfterCommand);
  console.log(`got output message: ${outputMessage}`);
  return outputMessage;
}

exports.handleMessageContent = handleMessageContent;
