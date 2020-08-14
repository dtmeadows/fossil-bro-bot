/* eslint-env mocha */
const assert = require('assert');

const ping = require('../../commands/ping.js');

describe('ping', () => {
  it('returns pong', () => {
    assert.equal('Pong.', ping.execute('!ping'));
  });
});
