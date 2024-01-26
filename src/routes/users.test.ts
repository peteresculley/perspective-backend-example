import { describe, expect, test, jest } from '@jest/globals';
import { usersGetHandler, usersPostHandler } from './users';

describe('users post handler', () => {
  test('with good input: adds to database and responds with new user', async () => {
    const newUser = {
      id: 'testid',
      name: 'testname',
      email: 'testemail@email.com'
    };
    const userWithId = { ...newUser, _id: '12345' };
    const addUserPromise = Promise.resolve(userWithId);
    const db = {
      addUser: jest.fn<any>().mockReturnValue(addUserPromise)
    } as any;

    const req = {
      body: { ...newUser }
    } as any;
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    } as any;

    usersPostHandler({ db })(req, res);

    expect(db.addUser).toBeCalledTimes(1);
    expect(db.addUser).toBeCalledWith({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: expect.any(Date)
    });
    await addUserPromise;

    expect(res.send).toBeCalledWith(newUser);
  });

  test('with bad input: does not add user and responds with error code', async () => {
    const db = {
      addUser: jest.fn<any>().mockResolvedValue({})
    } as any;

    const req = {
      body: {
        badinput: 'badinput'
      }
    } as any;
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    } as any;

    usersPostHandler({ db })(req, res);

    expect(db.addUser).not.toBeCalled();
    expect(res.status.mock.calls[0][0]).toBeGreaterThanOrEqual(400);
  });
});

describe('users get handler', () => {
  test('with no query: returns all users', async () => {
    const users = [{ _id: '1' }, { _id: '2' }];
    const getUsersPromise = Promise.resolve(users);
    const db = {
      getUsers: jest.fn<any>().mockReturnValue(getUsersPromise)
    } as any;

    const req = {
      query: {}
    } as any;
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    } as any;

    usersGetHandler({ db })(req, res);

    expect(db.getUsers).toBeCalledTimes(1);
    expect(db.getUsers).toBeCalledWith({
      sort: { created: undefined }
    });
    await getUsersPromise;

    expect(res.send).toBeCalledWith(users);
  });

  test('with created query: requests users to be sorted and returns all users', async () => {
    const users = [{ created_at: new Date(100) }, { created_at: new Date(200) }];
    const getUsersPromise = Promise.resolve(users);
    const db = {
      getUsers: jest.fn<any>().mockReturnValue(getUsersPromise)
    } as any;

    const req = {
      query: { created: 'asc' }
    } as any;
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    } as any;

    usersGetHandler({ db })(req, res);

    expect(db.getUsers).toBeCalledTimes(1);
    expect(db.getUsers).toBeCalledWith({
      sort: { created: 'asc' }
    });
    await getUsersPromise;

    expect(res.send).toBeCalledWith(users);
  });
});
