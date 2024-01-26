import { User } from '../../types/user';
import { DbClient } from '../dbClient';

export async function getUsers(this: DbClient, options: GetUsersOptions | undefined): Promise<User[]> {
  let query = this.client.db().collection<User>('users').find();

  const sortCreated = options?.sort?.created;
  if (sortCreated !== undefined) {
    query = query.sort('created_at', sortCreated);
  }

  return await query.toArray();
}

export type GetUsersOptions = {
  sort?: {
    created?: 'asc' | 'desc'
  }
};
