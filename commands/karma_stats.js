const { getKarmaStats } = require('../karma_database');

async function formatRankingArray(array) {
  return array.map((t, i) => {
    const [recipient, karmaCount] = t;

    return `   ${i + 1}. ${recipient}: ${karmaCount}`;
  });
}

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

    const top5Output = await formatRankingArray(top5);

    const bottom5Output = await formatRankingArray(bottom5);

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
      + `${bottom5Output.join('\n')}`;

    return newStatsMessage;
  },
};
