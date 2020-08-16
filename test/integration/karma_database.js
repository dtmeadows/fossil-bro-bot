/* eslint-env mocha */
const assert = require('assert');

const {
  lookupKarma, giveKarma, sequelize, karmaTable,
} = require('../../karma_database');

describe('karmaDatabase', () => {
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
