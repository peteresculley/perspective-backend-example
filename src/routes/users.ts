import { Request, Response } from 'express';
import { SetupRoutesProps } from '.';

import { validateUser } from '../db/methods/validateUser';

export const setupUsersRoutes = ({ app, db }: SetupRoutesProps): void => {
  app.post('/users', usersPostHandler({ db }));
  app.get('/users', usersGetHandler({ db }));
};

export const usersPostHandler = ({ db }: { db: SetupRoutesProps['db'] }) => (
  (req: Request, res: Response) => {
    const user = req.body;
    if (validateUser(user)) {
      user.created_at = new Date();
      db.addUser(user).then((userWithId) => {
        const { _id, ...userWithoutId } = userWithId;
        res.status(201).send(userWithoutId);
      }, (error) => {
        if (error?.error === 'duplicate key') {
          res.status(409).send({
            error: 'duplicate key',
            msg: `the values for ${error.keys.join(', ')} already exist`,
            duplicate_keys: error.keys
          });
        } else {
          res.status(500).send({});
        }
      });
    } else {
      res.status(400).send({});
    }
  }
);

export const usersGetHandler = ({ db }: { db: SetupRoutesProps['db'] }) => (
  (req: Request, res: Response) => {
    const queryCreated = req.query.created;
    const sortCreated = (queryCreated === 'asc' || queryCreated === 'desc') ? queryCreated : undefined;

    db.getUsers({ sort: { created: sortCreated } }).then((users) => {
      res.status(200).send(users);
    }, (error) => {
      console.error(error);
      res.status(500).send({});
    });
  }
);
