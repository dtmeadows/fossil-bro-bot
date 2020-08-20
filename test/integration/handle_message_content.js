/* eslint-env mocha */
const assert = require('assert');

const { clearDatabase } = require('../helpers/clear_database');
const { handleMessageContent } = require('../../handle_message_content.js');

describe('handleMessageContent', () => {
  beforeEach(async () => {
    clearDatabase(process.env.node_env || 'test');
  });

  it('returns nothing unless prefix is passed', async () => {
    assert.equal(undefined, await handleMessageContent('blur'));
  });

  it('returns helpful message if prefix is passed followed by space', async () => {
    assert.equal('Error! Unable to understand command.', await handleMessageContent('! ping'));
  });

  it('returns helpful message if unrecognized command is passed', async () => {
    assert.equal('Error! Unrecognized command: \'blah\'', await handleMessageContent('!blah'));
  });

  describe('command matching / calling', () => {
    describe('ping', () => {
      it('returns pong', async () => {
        assert.equal('Pong.', await handleMessageContent('!ping'));
      });
    });

    describe('++', () => {
      it('returns the right thing', async () => {
        assert.equal(await handleMessageContent('!++ user reason', 'server_abc123'), '++ user reason (now at 1)');
      });

      it('returns an error messsage if command cannot be parsed', async () => {
        assert.equal(await handleMessageContent('!++', 'server_abc123'), 'Error! Invalid format for ++ command. You must specify a recipient after ++');
      });

      it('runs via an alias', async () => {
        assert.equal(await handleMessageContent('!upvote user reason', 'server_abc123'), '++ user reason (now at 1)');
      });
    });

    describe('--', () => {
      it('returns the right thing', async () => {
        assert.equal(await handleMessageContent('!-- user reason', 'server_abc123'), '-- user reason (now at -1)');
      });

      it('runs via an alias', async () => {
        assert.equal(await handleMessageContent('!— user reason', 'server_abc123'), '-- user reason (now at -1)');
      });
    });

    describe('boating', () => {
      it('upboats', async () => {
        assert.equal(await handleMessageContent('!upboat user reason', 'server_abc123'), '🚤++ user reason (now at 1)🚤');
      });

      it('downboats', async () => {
        assert.equal(await handleMessageContent('!downboat user reason', 'server_abc123'), '🚤-- user reason (now at -1)🚤');
      });
    });
  });
});
