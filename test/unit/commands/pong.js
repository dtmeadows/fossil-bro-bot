/* eslint-env mocha */
const assert = require('assert');

const pong = require('../../../commands/pong');
const checkKarma = require('../../../commands/check_karma');

describe('pong', () => {
  it('decrements someone', async () => {
    assert.equal(await pong.execute('<@!138508771897901066>', 'server_abc123', '138508771897901066'), 'Results did not attain acceptable levels of certainty. Try again?');
    assert.equal(await checkKarma.execute('<@!138508771897901066>', 'server_abc123'), '<@138508771897901066> is at -1');
  });
});
