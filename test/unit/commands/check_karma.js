/* eslint-env mocha */
const assert = require('assert');

const checkKarma = require('../../../commands/check_karma');
const upvote = require('../../../commands/upvote');

const { clearDatabase } = require('../../helpers/clear_database');

describe('checkKarma', () => {
  beforeEach(async () => {
    clearDatabase(process.env.node_env || 'test');
  });

  it('parses just a user', async () => {
    await upvote.execute('user', 'server_abc123');
    assert.equal(await checkKarma.execute('user', 'server_abc123'), 'user is at 1');
  });

  it('parses just a mention', async () => {
    await upvote.execute('<@86890631690977280>', 'server_abc123');
    assert.equal(await checkKarma.execute('<@86890631690977280>', 'server_abc123'), '<@86890631690977280> is at 1');
  });

  it('returns 0 when a recipient has no karma entry', async () => {
    assert.equal(await checkKarma.execute('chickens', 'server_abc123'), 'chickens is at 0');
  });

  it('checks karma the same regardless of nicknames', async () => {
    await upvote.execute('<@!86890631690977280>', 'server_abc123');
    assert.equal(await checkKarma.execute('<@86890631690977280>', 'server_abc123'), '<@86890631690977280> is at 1');
    assert.equal(await checkKarma.execute('<@!86890631690977280>', 'server_abc123'), '<@86890631690977280> is at 1');
  });

  it('returns an error messsage if command cannot be parsed', async () => {
    assert.equal(await checkKarma.execute('', 'server_abc123'), 'Error! Invalid format for == command. You must specify a recipient after ==');
  });
});
