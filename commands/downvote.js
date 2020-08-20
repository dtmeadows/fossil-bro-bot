const { decrementKarma } = require('../karma_database');

const { extractKarmaRecipientAndReason } = require('./helpers');

module.exports = {
  name: '--',
  description: 'Remove 1 point from something',
  usage: '-- [recipient] [optional reason]',
  examples: ['-- carrots', '-- carrots for being so orange'],
  aliases: ['downvote'],
  secret_aliases: ['downboat', '—'], // — is an alias since many clients (like an iPhone) autocorrect `--` to `—`
  async execute(message, messageServerId) {
    const extraction = extractKarmaRecipientAndReason(message);

    if (extraction === null) {
      return 'Error! Invalid format for -- command. You must specify a recipient after --';
    }

    const { recipient, reason } = extraction;

    const karmaCount = await decrementKarma(recipient, false, messageServerId);

    // this will return either:
    // `-- recipient reason (now at xx)`
    // or if the reason is null
    // `-- recipient (now at xx)
    return [
      '--',
      recipient,
      reason,
      `(now at ${karmaCount})`,
    ].filter(Boolean).join(' ');
  },
};
