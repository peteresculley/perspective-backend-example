import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { DbClient } from './db/dbClient';
import { setupRoutes } from './routes';

dotenv.config();

const dbUri = process.env.MONGODB_URI || 'localhost:5000';
const db = new DbClient(dbUri);

const app = express();
app.use(cors())
  .use(express.json())
  .options('*', cors());

setupRoutes({ app, db });

const port = process.env.PORT || 3111;
db.init().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}).catch(console.error);
