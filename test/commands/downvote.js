/* eslint-env mocha */
const assert = require('assert');

const downvote = require('../../commands/downvote.js');

describe('downvote', () => {
  it('parses a user and a reason', async () => {
    assert.equal('-- user reason (now at XX)', await downvote.execute('user reason'));
  });

  it('parses just a user', async () => {
    assert.equal('-- user (now at XX)', await downvote.execute('user'));
  });
});
