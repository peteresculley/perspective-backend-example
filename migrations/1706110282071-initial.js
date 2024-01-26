const { setup, wrapper } = require('../migrate/migrationHelper');

setup();

module.exports.up = wrapper(async function up (client) {
  await client.db().createCollection('users');
  await client.db().collection('users').createIndex({ id: 1 }, { unique: true });
  await client.db().collection('users').createIndex({ email: 1 }, { unique: true });
});

module.exports.down = wrapper(async function down (client) {
  await client.db().dropCollection('users');
});
