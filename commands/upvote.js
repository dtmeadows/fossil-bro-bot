const { giveKarma, decrementKarma } = require('../karma_database');

module.exports = {
  name: '++',
  description: 'Add 1 point to something',
  usage: '++ [recipient] [optional reason]',
  examples: ['++ carrots', '++ carrots for being so crunchy'],
  aliases: ['upvote'],
  secret_aliases: ['upboat'],
  async execute(message, messageServerId, sender) {
    const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null || message === undefined) {
      return 'Error! Invalid format for ++ command. You must specify a recipient after ++';
    }

    const { recipient, reason } = regexpExtract.groups;

    let karmaCount = null;
    if (recipient === `<@!${sender}>`) {
      // we don't advertise it, but if you give yourself karma, you lose karma.
      karmaCount = await decrementKarma(recipient, false, messageServerId);
    } else {
      karmaCount = await giveKarma(recipient, false, messageServerId);
    }
    // this will return either:
    // `++ recipient reason (now at xx)`
    // or if the reason is null
    // `++ recipient (now at xx)
    return [
      '++',
      recipient,
      reason,
      `(now at ${karmaCount})`,
    ].filter(Boolean).join(' ');
  },
};
