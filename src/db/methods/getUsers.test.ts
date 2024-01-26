import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoClient } from 'mongodb';
import { getUsers } from './getUsers';
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

  test('get nothing when DB is empty', async () => {
    const users = await getUsers.call({ client });

    expect(users).toHaveLength(0);
  });

  test('gets users when they are in DB', async () => {
    await client.db().collection('users').insertMany([
      { id: '1', name: 'user1', email: 'testing1@email.com', created_at: new Date(100) },
      { id: '2', name: 'user2', email: 'testing2@email.com', created_at: new Date(200) },
      { id: '3', name: 'user3', email: 'testing3@email.com', created_at: new Date(300) }
    ]);

    const users: User[] = await getUsers.call({ client });

    expect(users).toHaveLength(3);
    const usersIds = users.map(({ id }) => id);
    expect(usersIds).toContain('1');
    expect(usersIds).toContain('2');
    expect(usersIds).toContain('3');
  });

  test('gets users sorted by created_at when sorting is requested', async () => {
    await client.db().collection('users').insertMany([
      { id: '1', name: 'user1', email: 'testing1@email.com', created_at: new Date(100) },
      { id: '2', name: 'user2', email: 'testing2@email.com', created_at: new Date(200) },
      { id: '3', name: 'user3', email: 'testing3@email.com', created_at: new Date(300) }
    ]);

    const users: User[] = await getUsers.call({ client }, { sort: { created: 'desc' } });

    expect(users).toHaveLength(3);
    expect(users[0].created_at.getTime()).toBe(300);
    expect(users[1].created_at.getTime()).toBe(200);
    expect(users[2].created_at.getTime()).toBe(100);
  });
});
