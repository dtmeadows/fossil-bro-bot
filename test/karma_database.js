/* eslint-env mocha */
const assert = require('assert');

const { lookupKarma, giveKarma } = require('../karma_database');

describe('lookupKarma', () => {
  it('looks up karma', async () => {
    const karma = await lookupKarma('jsin', false, 'abc123');

    assert(Number.isInteger(karma));
  });
});

describe('giveKarma', () => {
  it('increments karma', async () => {
    const currentKarma = await lookupKarma('jsin', false, 'abc123');
    const incrementedKarma = await giveKarma('jsin', false, 'abc123');
    assert.equal(currentKarma + 1, incrementedKarma);
  });
});
