const { getKarmaStats } = require('../karma_database');

module.exports = {
  name: 'stats',
  description: 'Get the current Karma stats for the server',
  usage: 'stats',
  examples: ['stats'],
  aliases: ['s'],
  async execute(message, messageServerId) {
    const [top5, bottom5] = await getKarmaStats(messageServerId);

    if (top5 === undefined || top5.length === 0) {
      return 'No karma have been given to recipients yet. Try adding some first and then run this command again.';
    }
    const statsMessage = [];
    statsMessage.push('Top Karma recipients:');
    top5.forEach((t) => {
      statsMessage.push(` ${t[0]}: ${t[1]}`);
    });

    statsMessage.push('');

    statsMessage.push('Lowest Karma recipients:');
    bottom5.forEach((t) => {
      statsMessage.push(` ${t[0]}: ${t[1]}`);
    });

    return statsMessage.join('\n');
  },
};
