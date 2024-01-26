import { describe, test, expect } from '@jest/globals';
import { validateUser } from './validateUser';

describe('validateUser', () => {
  test('succeeds with normal user', () => {
    const user = {
      id: 'testid',
      name: 'normal user name',
      email: 'test@example.com'
    } as any;
    expect(validateUser(user)).toBeTruthy();

    const userWithCreatedAt = {
      id: 'testid',
      name: 'normal user name',
      email: 'test@example.com',
      created_at: new Date(100)
    } as any;
    expect(validateUser(userWithCreatedAt)).toBeTruthy();
  });

  test('reject user with extra fields', () => {
    const userWithBadFields = {
      id: 'testid',
      name: 'watch out',
      email: 'malicious@hacker.net',
      command: 'drop database'
    } as any;
    expect(validateUser(userWithBadFields)).toBeFalsy();
  });

  test('reject user with missing fields', () => {
    const missingUser = {
      name: 'id is missing',
      email: 'oops@missing.org'
    } as any;
    expect(validateUser(missingUser)).toBeFalsy();
  });

  test('reject user with misformed email', () => {
    const funkyEmailUser = {
      id: 'fe123',
      name: 'funky name',
      email: 'funky@email@email@.com'
    } as any;
    expect(validateUser(funkyEmailUser)).toBeFalsy();
  });

  test('reject user that is not an object', () => {
    const userPerhaps = 'select * from permissions;' as any;
    expect(validateUser(userPerhaps)).toBeFalsy();
  });
});
