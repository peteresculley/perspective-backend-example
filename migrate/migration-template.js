const { setup, wrapper } = require('../migrationHelper');

setup();

module.exports.up = wrapper(async function up (client) {
  //
});

module.exports.down = wrapper(async function down (client) {
  //
});
