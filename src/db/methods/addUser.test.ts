import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoClient } from 'mongodb';
import { addUser } from './addUser';
import { User } from '../../types/user';

describe('insert', () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = new MongoClient((<any>global).__MONGO_URI__);
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await client.db().collection('users').deleteMany({});
  });

  test('add user works normally', async () => {
    const addedUser = await addUser.call({ client }, {
      id: 'testid',
      name: 'userToBeAdded',
      email: 'testing@email.com',
      created_at: new Date(100)
    });

    expect(addedUser).toHaveProperty('_id');

    const allDbUsers = await client.db().collection<User>('users').find({}).toArray();

    expect(allDbUsers).toHaveLength(1);
    const dbUser = allDbUsers[0];
    expect(dbUser.id).toBe('testid');
    expect(dbUser.name).toBe('userToBeAdded');
    expect(dbUser.email).toBe('testing@email.com');
    expect(dbUser.created_at).toBeInstanceOf(Date);
    expect(dbUser.created_at.getTime()).toBe(100);
    expect(dbUser._id.toString()).toBe(addedUser._id);
  });
});
