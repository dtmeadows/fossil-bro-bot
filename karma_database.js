const Sequelize = require('sequelize');

let sequelize = null;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
} else {
  // todo someday: it's not super ideal to use a different database backing
  // for testing, but it's far, far easier to just use sqlite in-memory here
  // rather than trying to setup something similar with Postgres
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
}

const KarmaTable = sequelize.define('karma', {
  recipient: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  is_user: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  karma_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  server: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

async function findKarma(query) {
  return KarmaTable.findOne({ where: query });
}

async function setOrCreateKarma(query, increment) {
  return findKarma(query).then((karma) => {
    if (!karma) {
      // Item not found, create a new one
      const newQuery = query;
      // KarmaTable starts at 0, but we're always initializing
      // it when someones up or downvoting something
      newQuery.karma_count = increment ? 1 : -1;
      return KarmaTable.create(query).then((newKarma) => newKarma.karma_count);
    }

    if (increment) {
      karma.increment('karma_count');
    } else {
      karma.decrement('karma_count');
    }

    return karma.reload().then(() => karma.karma_count);
  });
}

async function giveKarma(recipient, isUser, serverId) {
  const query = { recipient, is_user: isUser, server: serverId };
  return setOrCreateKarma(query, true);
}

async function decrementKarma(recipient, isUser, serverId) {
  const query = { recipient, is_user: isUser, server: serverId };
  return setOrCreateKarma(query, false);
}

async function lookupKarma(recipient, isUser, serverId) {
  const query = { recipient, is_user: isUser, server: serverId };
  return findKarma(query).then((karma) => {
    if (!karma) {
      return null;
    }
    return karma.karma_count;
  });
}

KarmaTable.sync();

exports.giveKarma = giveKarma;
exports.lookupKarma = lookupKarma;
exports.decrementKarma = decrementKarma;
exports.sequelize = sequelize;
exports.karmaTable = KarmaTable;
