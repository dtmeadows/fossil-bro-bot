/* eslint-env mocha */
const assert = require('assert');

const {
  lookupKarma, giveKarma,
} = require('../../karma_database');
const { clearDatabase } = require('../helpers/clear_database');

describe('karmaDatabase', () => {
  beforeEach(async () => {
    clearDatabase(process.env.node_env || 'test');
  });
  describe('lookupKarma', () => {
    it('looks up karma', async () => {
      await giveKarma('jsin', false, 'abc123');
      const karma = await lookupKarma('jsin', false, 'abc123');

      assert.equal(karma, 1);
    });

    describe('giveKarma', () => {
      it('increments karma', async () => {
        const currentKarma = await lookupKarma('jsin', false, 'abc123');
        const incrementedKarma = await giveKarma('jsin', false, 'abc123');
        assert.equal(currentKarma + 1, incrementedKarma);

        const currentKarmaAgain = await lookupKarma('jsin', false, 'abc123');
        const incrementedKarmaAgain = await giveKarma('jsin', false, 'abc123');
        assert.equal(currentKarmaAgain + 1, incrementedKarmaAgain);
      });

      it('sets karma to 1 if new entry', async () => {
        const randomRecipient = Math.random().toString();
        const currentKarma = await lookupKarma(randomRecipient, false, 'abc123');

        assert.equal(null, currentKarma);

        const incrementedKarma = await giveKarma(randomRecipient, false, 'abc123');
        assert.equal(1, incrementedKarma);
      });
    });
  });
});
