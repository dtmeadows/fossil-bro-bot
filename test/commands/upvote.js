/* eslint-env mocha */
const assert = require('assert');

const upvote = require('../../commands/upvote.js');

describe('upvote', () => {
  it('parses a user and a reason', async () => {
    assert.match(await upvote.execute('user reason'), /\+\+ user reason \(now at \d+\)/);
  });

  it('parses just a user', async () => {
    assert.match(await upvote.execute('user'), /\+\+ user \(now at \d+\)/);
  });
});
