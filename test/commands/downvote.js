/* eslint-env mocha */
const assert = require('assert');

const downvote = require('../../commands/downvote.js');

describe('downvote', () => {
  it('parses a user and a reason', async () => {
    assert.match(await downvote.execute('user reason'), /-- user reason \(now at \d+\)/);
  });

  it('parses just a user', async () => {
    assert.match(await downvote.execute('user'), /-- user \(now at \d+\)/);
  });

  it('returns an error messsage if command cannot be parsed', async () => {
    assert.equal(await downvote.execute(''), 'Error! Invalid format for -- command. You must specify a recipient after --');
  });
});
