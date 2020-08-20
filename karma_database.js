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
    // this is not unique because it can be re-used across servers
    unique: false,
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
      console.log(`setOrCreateKarma: no karma found for ${query.recipient}`);
      // Item not found, create a new one
      const newQuery = query;
      // KarmaTable starts at 0, but we're always initializing
      // it when someones up or downvoting something
      newQuery.karma_count = increment ? 1 : -1;
      return KarmaTable.create(query).then((newKarma) => newKarma.karma_count);
    }

    if (increment) {
      console.log(`setOrCreateKarma: incrementing karma from ${karma.karma_count} for ${query.recipient}`);
      karma.increment('karma_count');
    } else {
      console.log(`setOrCreateKarma: decrementing karma from ${karma.karma_count} for ${query.recipient}`);
      karma.decrement('karma_count');
    }

    return karma.reload().then(() => karma.karma_count);
  });
}

async function lookupKarmaStats(serverId) {
  const bottom5 = KarmaTable.findAll({
    where: { server: serverId },
    order: [
      ['karma_count', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    limit: 5,
  });

  const top5 = KarmaTable.findAll({
    where: { server: serverId },
    order: [
      ['karma_count', 'DESC'],
      ['createdAt', 'ASC'],
    ],
    limit: 5,
  });

  return [await top5, await bottom5];
}

async function getKarmaStats(serverId) {
  const [top5, bottom5] = await lookupKarmaStats(serverId);

  const top5Array = top5.map((k) => [k.recipient, k.karma_count]);
  const bottom5Array = bottom5.map((k) => [k.recipient, k.karma_count]);

  return [top5Array, bottom5Array];
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
      console.log(`lookupKarma: no karma found for ${recipient}`);
      return null;
    }
    console.log(`lookupKarma: found ${karma.karma_count} for ${recipient}`);
    return karma.karma_count;
  });
}

KarmaTable.sync();

exports.giveKarma = giveKarma;
exports.lookupKarma = lookupKarma;
exports.decrementKarma = decrementKarma;
exports.sequelize = sequelize;
exports.karmaTable = KarmaTable;
exports.getKarmaStats = getKarmaStats;
