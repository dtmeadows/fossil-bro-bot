const { giveKarma } = require('../karma_database');
const { extractKarmaRecipientAndReason } = require('./helpers');

module.exports = {
  name: '++',
  description: 'Add 1 point to something',
  usage: '++ [recipient] [optional reason]',
  examples: ['++ carrots', '++ carrots for being so crunchy'],
  aliases: ['upvote'],
  secret_aliases: ['upboat'],
  async execute(message, messageServerId) {
    let recipient = null;
    let reason = null;
    try {
      ({ recipient, reason } = extractKarmaRecipientAndReason(message));
    } catch (e) {
      return e.message;
    }

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
