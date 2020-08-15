const { giveKarma } = require('../karma_database');

module.exports = {
  name: '++',
  description: 'Upvote something',
  async execute(message) {
    const regex = /(?<recipient>\w+)\s*(?<reason>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null) {
      // todo add better error message
      return 'invalid format for ++ command';
    }

    const { recipient, reason } = regexpExtract.groups;

    // todo parse users and server
    const karmaCount = await giveKarma(recipient, false, 'abc123');

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
