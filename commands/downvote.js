const { decrementKarma } = require('../karma_database');

module.exports = {
  name: '--',
  description: 'Downvote something',
  aliases: ['upvote'],
  secret_aliases: ['upboat', '—'], // — is an alias since many clients (like an iPhone) autocorrect `--` to `—`
  async execute(message, messageServerId) {
    const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null || message === undefined) {
      return 'Error! Invalid format for -- command. You must specify a recipient after --';
    }

    const { recipient, reason } = regexpExtract.groups;

    // todo parse users and server
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
