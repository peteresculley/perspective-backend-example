import { User, UserWithId } from '../../types/user';
import { DbClient } from '../dbClient';

export async function addUser(this: DbClient, user: User): Promise<UserWithId> {
  try {
    const insertedInfo = await this.client.db().collection<User>('users').insertOne(user);
    const id = insertedInfo.insertedId.toString();
  
    return {
      ...user,
      _id: id
    };
  } catch (error) {
    if (error?.code === 11000) { // error.code 11000 = duplicate key
      throw {
        error: 'duplicate key',
        keys: Object.keys(error.keyPattern)
      };
    }
    throw error;
  }
}
