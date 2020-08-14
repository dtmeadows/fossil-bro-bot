module.exports = {
  name: '--',
  description: 'Downvote something',
  execute(message) {
    const regex = /(?<recipient>\w+)\s+(?<reason>.*)/;
    const matches = regex.exec(message);
    return `-- ${matches.recipient} ${matches.reason} (now at XX)`;
  },
};
