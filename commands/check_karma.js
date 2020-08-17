const { lookupKarma } = require('../karma_database');

module.exports = {
  name: '==',
  description: 'Get the current Karma of something',
  aliases: ['k'],
  async execute(message, messageServerId) {
    // todo: should we fire an error if you send anything after the recipient?
    const regex = /(?<recipient>\S+)\s*(?<_otherText>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null || message === undefined) {
      return 'Error! Invalid format for == command. You must specify a recipient after ==';
    }

    const { recipient } = regexpExtract.groups;

    // if no karma entry is currently in the database, return 0
    const karmaCount = await lookupKarma(recipient, false, messageServerId) || 0;

    return `${recipient} is at ${karmaCount}`;
  },
};
