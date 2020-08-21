/* eslint-env mocha */
const assert = require('assert');

const karmaStats = require('../../../commands/karma_stats.js');

const upvote = require('../../../commands/upvote');
const downvote = require('../../../commands/downvote');

describe('stat', () => {
  it('it returns a help message if no karma has been added yet', async () => {
    const expectedMessage = 'No karma have been given to recipients yet. Try adding some first and then run this command again.';

    assert.equal(expectedMessage, await karmaStats.execute(null, 'abc_123'));
  });

  it('returns stats message', async () => {
    const serverId = 'abc123';
    await upvote.execute('jsin', serverId);
    await upvote.execute('jsin', serverId);
    await upvote.execute('jsin', serverId);

    await upvote.execute('dtm', serverId);
    await upvote.execute('dtm', serverId);

    await upvote.execute('carrots', serverId);

    await upvote.execute('elephants', serverId);

    await upvote.execute('bananas', serverId);

    await downvote.execute('jerks', serverId);
    await downvote.execute('jerks', serverId);

    await downvote.execute('haters', serverId);

    const expectedMessage = '**Top Karma recipients:**\n'
      + '   1. jsin: 3\n'
      + '   2. dtm: 2\n'
      + '   3. carrots: 1\n'
      + '   4. elephants: 1\n'
      + '   5. bananas: 1\n\n'
      + '**Lowest Karma recipients:**\n'
      + '   1. jerks: -2\n'
      + '   2. haters: -1\n'
      + '   3. bananas: 1\n'
      + '   4. elephants: 1\n'
      + '   5. carrots: 1';

    assert.equal(expectedMessage, await karmaStats.execute(null, serverId));
  });
});
