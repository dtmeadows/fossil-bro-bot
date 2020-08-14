module.exports = {
  name: '--',
  description: 'Upvote something',
  execute(message) {
    const regex = /(?<recipient>\w+)\s*(?<reason>.*)?/;
    const regexpExtract = regex.exec(message);

    if (regexpExtract === null) {
      // todo add better error message
      return 'invalid format for -- command';
    }

    // this will return either:
    // `-- recipient reason (now at xx)`
    // or if the reason is null
    // `-- recipient (now at xx)
    return [
      '--',
      regexpExtract.groups.recipient,
      regexpExtract.groups.reason,
      '(now at XX)',
    ].filter(Boolean).join(' ');
  },
};
