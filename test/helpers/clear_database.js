const {
  sequelize, karmaTable,
} = require('../../karma_database');

async function clearDatabase(nodeEnv) {
  if (nodeEnv === 'test') {
    await sequelize.drop();
    await karmaTable.sync();
  } else {
    console.error('uh not cool');
    console.log(nodeEnv);
  }
}

exports.clearDatabase = clearDatabase;
