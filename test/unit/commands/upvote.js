/* eslint-env mocha */
const assert = require('assert');

const upvote = require('../../../commands/upvote.js');

const {
  sequelize, karmaTable,
} = require('../../../karma_database');

describe('upvote', () => {
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
  it('parses a user and a reason', async () => {
    assert.equal(await upvote.execute('user reason'), '++ user reason (now at 1)');
  });

  it('parses just a user', async () => {
    assert.equal(await upvote.execute('user'), '++ user (now at 1)');
  });

  it('returns an error messsage if command cannot be parsed', async () => {
    assert.equal(await upvote.execute(''), 'Error! Invalid format for ++ command. You must specify a recipient after ++');
  });
});
