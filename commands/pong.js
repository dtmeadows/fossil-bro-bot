const { decrementKarma } = require('../karma_database');

module.exports = {
  name: 'pong',
  description: 'Who knows what it does!',
  usage: 'Try it and find out',
  examples: ['pong'],
  secret_command: true,
  async execute(message, messageServerId, sender) {
    // sending pong downvotes yourself
    await decrementKarma(`<@${sender}>`, false, messageServerId);

    return 'Results did not attain acceptable levels of certainty. Try again?';
  },
};
