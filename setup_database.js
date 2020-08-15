const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const Karma = sequelize.define('karma', {
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
  return Karma.findOne({ where: query });
}

async function incrementOrCreateAndIncrementKarma(query) {
  return findKarma(query).then((karma) => {
    if (!karma) {
      // Item not found, create a new one
      console.log('creating item');
      return Karma.create(query).then((newKarma) => newKarma.karma_count);
    } else {
      karma.increment('karma_count');
      return karma.reload().then(() => karma.karma_count);
    }
  });
}

async function giveKarma(recipient, isUser, serverId) {
  const query = { recipient, is_user: isUser, server: serverId };
  return incrementOrCreateAndIncrementKarma(query);
}

async function lookupKarma(recipient, isUser, serverId) {
  const query = { recipient, is_user: isUser, server: serverId };
  return findKarma(query).then((karma) => {
    if (!karma) {
      // console.log(`recipient: ${recipient} has no karma stored`);
      return null;
    }
    // console.log(`recipient: ${recipient} has ${karma.karma_count} karma`);
    return karma.karma_count;
  });
}

Karma.sync();


// lookupKarma('jsin', false, 'abc123').then((karmaCount) => {
//   console.log(`karma count: ${karmaCount}`);
// });
giveKarma('jsin', false, 'abc123').then((karmaCount) => {
  console.log(`recipient: 'jsin' now has ${karmaCount} karma`);
});
