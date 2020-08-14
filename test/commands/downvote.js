/* eslint-env mocha */
const assert = require('assert');

const downvote = require('../../commands/downvote.js');

describe('downvote', () => {
  it('parses a user and a reason', () => {
    assert.equal('-- user reason (now at XX)', downvote.execute('user reason'));
  });

  it('parses just a user', () => {
    assert.equal('-- user (now at XX)', downvote.execute('user'));
  });
});
