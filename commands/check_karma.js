const { lookupKarma } = require('../karma_database');

const { extractKarmaRecipientAndReason } = require('./helpers');

module.exports = {
  name: '==',
  description: 'Get the current Karma of something',
  usage: '== [recipient]',
  examples: ['== carrots'],
  aliases: ['k'],
  async execute(message, messageServerId) {
    const extraction = extractKarmaRecipientAndReason(message);

    if (extraction === null) {
      return 'Error! Invalid format for == command. You must specify a recipient after ==';
    }

    const { recipient } = extraction;

    // if no karma entry is currently in the database, return 0
    const karmaCount = await lookupKarma(recipient, false, messageServerId) || 0;

    return `${recipient} is at ${karmaCount}`;
  },
};
