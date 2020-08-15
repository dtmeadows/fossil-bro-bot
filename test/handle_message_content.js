/* eslint-env mocha */
const assert = require('assert');

const { handleMessageContent } = require('../handle_message_content.js');

describe('handleMessageContent', () => {
  it('returns nothing unless prefix is passed', async () => {
    assert.equal(undefined, await handleMessageContent('blur'));
  });

  it('returns nothing if prefix is passed followed by space', async () => {
    assert.equal(undefined, await handleMessageContent('! ping'));
  });

  describe('ping', () => {
    it('returns pong', async () => {
      assert.equal('Pong.', await handleMessageContent('!ping'));
    });
  });

  describe('++', () => {
    it('returns the right thing', async () => {
      assert.match(await handleMessageContent('!++ user reason'), /\+\+ user reason \(now at \d+\)/);
    });
  });
});
