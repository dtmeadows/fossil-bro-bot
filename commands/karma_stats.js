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

    const top5Output = top5.map((t, i) => {
      const [recipient, karmaCount] = t;
      return `   ${i + 1}. ${recipient}: ${karmaCount}`;
    });
    // Example output:
    // Top Karma recipients:
    //  1. stats: 3
    //  2. blur: 4
    //  3. baz: -1
    // Lowest Karma recipients:
    //  1. baz: -1
    //  2. stats: 3
    //  3. blur: 1
    const newStatsMessage = '**Top Karma recipients:**\n'
      + `${top5Output.join('\n')}`
      + '\n\n'
      + '**Lowest Karma recipients:**\n'
      + `${bottom5.map((t, i) => `   ${i + 1}. ${t[0]}: ${t[1]}`).join('\n')}`;

    return newStatsMessage;
  },
};
