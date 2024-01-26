const { MongoClient } = require('mongodb');
const { setup } = require('./migrationHelper');

setup();
const dbUri = process.env.MONGODB_URI;

module.exports = class MongoDbStore {
  async load (fn) {
    const client = new MongoClient(dbUri);
    try {
      await client.connect();
      const data = await client.db().collection('db_migrations').find().toArray();
      if (data.length !== 1) {
        console.log('Cannot read migrations from database. If this is the first time you run migrations, then this is normal.');
        return fn(null, {});
      } else {
        return fn(null, data[0]);
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await client.close();
    }
  };

  async save (set, fn) {
    const upMigrations = set.migrations.filter(({ timestamp }) => timestamp);
    const downMigrations = set.migrations.filter(({ timestamp }) => !timestamp);
    const client = new MongoClient(dbUri);
    try {
      await client.connect();
      const result = await client.db().collection('db_migrations')
        .updateOne({}, {
          $set: {
            lastRun: set.lastRun
          },
          ...(upMigrations.length > 0 ? {
            $push: {
              migrations: { $each: upMigrations }
            },
          } : {}),
          ...(downMigrations.length > 0 ? {
            $pull: {
              migrations: { title: { $in: downMigrations.map(({ title }) => title) } }
            }
          } : {}),
        }, { upsert: true });

      return fn(null, result);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await client.close();
    }
  }
}
