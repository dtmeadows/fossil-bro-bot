/* eslint-env mocha */
const assert = require('assert');

const { handleMessageContent } = require('../handle_message_content.js');

describe('handleMessageContent', () => {
  it('returns nothing unless prefix is passed', () => {
    assert(handleMessageContent('blur') === undefined);
  });

  it('returns nothing if prefix is passed followed by space', () => {
    assert(handleMessageContent('! ping') === undefined);
  });

  describe('ping', () => {
    it('returns pong', () => {
      assert.equal('Pong.', handleMessageContent('!ping'));
    });
  });

  describe('++', () => {
    it('returns the right thing', () => {
      assert.equal('++ user reason (now at XX)', handleMessageContent('!++ user reason'));
    });
  });
});
