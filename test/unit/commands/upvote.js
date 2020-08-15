/* eslint-env mocha */
const assert = require('assert');
const upvote = require('../../../commands/upvote.js');

describe('upvote', () => {
  describe('successful calls', () => {
    it('parses a user and a reason', async () => {
      assert.match(await upvote.execute('user reason'), /\+\+ user reason \(now at \d+\)/);
    });

    it('parses just a user', async () => {
      assert.match(await upvote.execute('user'), /\+\+ user \(now at \d+\)/);
    });
  });

  describe('errors calls', () => {
    it('returns an error messsage if command cannot be parsed', async () => {
      assert.equal(await upvote.execute(''), 'Error! Invalid format for ++ command. You must specify a recipient after ++');
    });
  });
});
