/* eslint-env mocha */
const assert = require('assert');

const upvote = require('../../commands/upvote.js');

describe('upvote', () => {
  it('parses a user and a reason', () => {
    assert.equal('++ user reason (now at XX)', upvote.execute('user reason'));
  });

  it('parses just a user', () => {
    assert.equal('++ user (now at XX)', upvote.execute('user'));
  });
});
