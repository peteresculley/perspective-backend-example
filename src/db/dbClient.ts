import { MongoClient } from 'mongodb';
import { getUsers } from './methods/getUsers';
import { addUser } from './methods/addUser';

export class DbClient {
  protected client: MongoClient;

  constructor(connectionUri: string) {
    this.client = new MongoClient(connectionUri);
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      await this.client.close();
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }

  addUser = addUser
  getUsers = getUsers
}
