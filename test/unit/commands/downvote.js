/* eslint-env mocha */
const assert = require('assert');

const downvote = require('../../../commands/downvote.js');

const { clearDatabase } = require('../../helpers/clear_database');

describe('downvote', () => {
  beforeEach(async () => {
    clearDatabase(process.env.node_env || 'test');
  });
  it('parses a user and a reason', async () => {
    assert.equal(await downvote.execute('user reason', 'server_abc123'), '-- user reason (now at -1)');
  });

  it('parses just a user', async () => {
    assert.equal(await downvote.execute('user', 'server_abc123'), '-- user (now at -1)');
  });

  it('parses a mention and a reason', async () => {
    assert.equal(await downvote.execute('<@86890631690977280> reason', 'server_abc123'), '-- <@86890631690977280> reason (now at -1)');
  });

  it('parses just a mention', async () => {
    assert.equal(await downvote.execute('<@86890631690977280>', 'server_abc123'), '-- <@86890631690977280> (now at -1)');
  });

  it('assigns karma the same regardless of nicknames', async () => {
    assert.equal(
      await downvote.execute('<@!86890631690977280>', 'server_abc123'),
      '-- <@86890631690977280> (now at -1)',
    );

    assert.equal(
      await downvote.execute('<@86890631690977280>', 'server_abc123'),
      '-- <@86890631690977280> (now at -2)',
    );
  });

  it('returns an error messsage if command cannot be parsed', async () => {
    assert.equal(await downvote.execute('', 'server_abc123'), 'Error! Invalid format for -- command. You must specify a recipient after --');
  });
});
