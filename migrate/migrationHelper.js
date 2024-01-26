const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

module.exports.setup = function setup () {
  dotenv.config();
}

module.exports.wrapper = function wrapper (migration) {
  return async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      await migration(client);
    } finally {
      await client.close();
    }
  };
}
