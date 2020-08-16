const { giveKarma } = require('../karma_database');

module.exports = {
  name: '++',
  description: 'Upvote something',
  async execute(message, messageServerId) {
    const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null || message === undefined) {
      return 'Error! Invalid format for ++ command. You must specify a recipient after ++';
    }

    const { recipient, reason } = regexpExtract.groups;

    // todo parse users and server
    const karmaCount = await giveKarma(recipient, false, messageServerId);

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
