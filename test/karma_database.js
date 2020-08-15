/* eslint-env mocha */
const assert = require('assert');

const { lookupKarma } = require('../karma_database');

describe('lookupKarma', () => {
  it('looks up karma', () => {
    const expectedKarma = 27;
    const actualKarma = lookupKarma('jsin', false, 'abc123');

    return actualKarma.then((result) => {
      assert.equal(expectedKarma, result);
    });
  });
});
