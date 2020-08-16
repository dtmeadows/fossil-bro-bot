/* eslint-env mocha */
const assert = require('assert');

const { handleMessageContent } = require('../../handle_message_content.js');
const { sequelize, karmaTable } = require('../../karma_database');

describe('handleMessageContent', () => {
  beforeEach(async () => {
    const processingEnv = process.env.node_env || 'test';
    if (processingEnv === 'test') {
      await sequelize.drop();
      await karmaTable.sync();
    } else {
      console.error('uh not cool');
      console.log(processingEnv);
    }
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

  describe('ping', () => {
    it('returns pong', async () => {
      assert.equal('Pong.', await handleMessageContent('!ping'));
    });
  });

  describe('++', () => {
    it('returns the right thing', async () => {
      assert.match(await handleMessageContent('!++ user reason', 'server_abc123'), /\+\+ user reason \(now at \d+\)/);
    });

    it('returns an error messsage if command cannot be parsed', async () => {
      assert.equal(await handleMessageContent('!++', 'server_abc123'), 'Error! Invalid format for ++ command. You must specify a recipient after ++');
    });
  });
});
