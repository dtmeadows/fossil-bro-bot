/* eslint-env mocha */
const assert = require('assert');

const {
  lookupKarma, giveKarma, decrementKarma, getKarmaStats,
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

  describe('decrementKarma', () => {
    it('decrements karma', async () => {
      const currentKarma = await lookupKarma('jsin', false, 'abc123');
      const decrementedKarma = await decrementKarma('jsin', false, 'abc123');
      assert.equal(currentKarma - 1, decrementedKarma);

      const currentKarmaAgain = await lookupKarma('jsin', false, 'abc123');
      const decrementedKarmaAgain = await decrementKarma('jsin', false, 'abc123');
      assert.equal(currentKarmaAgain - 1, decrementedKarmaAgain);
    });

    it('sets karma to -1 if new entry', async () => {
      const randomRecipient = Math.random().toString();
      const currentKarma = await lookupKarma(randomRecipient, false, 'abc123');

      assert.equal(null, currentKarma);

      const decrementedKarma = await decrementKarma(randomRecipient, false, 'abc123');
      assert.equal(-1, decrementedKarma);
    });
  });

  describe('getKarmaStats', () => {
    it('returns stats', async () => {
      const serverId = 'abc123';
      await giveKarma('jsin', false, serverId);
      await giveKarma('jsin', false, serverId);
      await giveKarma('jsin', false, serverId);

      await giveKarma('dtm', false, serverId);
      await giveKarma('dtm', false, serverId);

      await giveKarma('carrots', false, serverId);

      await giveKarma('elephants', false, serverId);

      await giveKarma('bananas', false, serverId);

      await decrementKarma('jerks', false, serverId);
      await decrementKarma('jerks', false, serverId);

      await decrementKarma('haters', false, serverId);

      const [top5, bottom5] = await getKarmaStats(serverId);

      const expectedTop5 = [
        ['jsin', 3],
        ['dtm', 2],
        ['carrots', 1],
        ['elephants', 1],
        ['bananas', 1],
      ];

      assert.deepEqual(expectedTop5, top5);

      const expectedBottom5 = [
        ['jerks', -2],
        ['haters', -1],
        ['bananas', 1],
        ['elephants', 1],
        ['carrots', 1],
      ];

      assert.deepEqual(expectedBottom5, bottom5);
    });

    it('returns empty arrays for no values', async () => {
      const serverId = 'abc123';

      const [top5, bottom5] = await getKarmaStats(serverId);

      const expectedTop5 = [];

      assert.deepEqual(expectedTop5, top5);

      const expectedBottom5 = [];

      assert.deepEqual(expectedBottom5, bottom5);
    });

    it('returns something the correct thing for few values', async () => {
      const serverId = 'abc123';

      await giveKarma('jsin', false, serverId);
      await giveKarma('jsin', false, serverId);
      await giveKarma('jsin', false, serverId);

      await decrementKarma('jerks', false, serverId);
      await decrementKarma('jerks', false, serverId);

      await decrementKarma('haters', false, serverId);

      const [top5, bottom5] = await getKarmaStats(serverId);

      const expectedTop5 = [
        ['jsin', 3],
        ['haters', -1],
        ['jerks', -2],
      ];

      assert.deepEqual(expectedTop5, top5);

      const expectedBottom5 = [
        ['jerks', -2],
        ['haters', -1],
        ['jsin', 3],
      ];

      assert.deepEqual(expectedBottom5, bottom5);
    });
  });
});
