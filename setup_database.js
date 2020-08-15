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

Karma.sync();

// lookupKarma('jsin', false, 'abc123').then((karmaCount) => {
//   console.log(`karma count: ${karmaCount}`);
// });
giveKarma('jsin', false, 'abc123').then((karmaCount) => {
  console.log(`recipient: 'jsin' now has ${karmaCount} karma`);
});
