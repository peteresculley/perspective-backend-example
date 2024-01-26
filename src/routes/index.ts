import { Express } from 'express';
import { DbClient } from '../db/dbClient';
import { setupUsersRoutes } from './users';

export interface SetupRoutesProps {
  app: Express;
  db: DbClient;
}

export const setupRoutes = ({ app, db }: SetupRoutesProps): void => {
  setupUsersRoutes({ app, db });
};
