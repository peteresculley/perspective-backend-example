import { User } from '../../types/user';

const allowedUserProps = ['name', 'id', 'email', 'created_at'];

export const validateUser = (user: User): boolean => {
  if (typeof user !== 'object') {
    return false;
  }

  if(
    !Object.keys(user)
      .reduce((acc, key) => acc && allowedUserProps.includes(key), true)
  ) {
    return false;
  }

  if (typeof user.id !== 'string') {
    return false;
  }

  if (typeof user.email !== 'string' || !isEmail(user.email)) {
    return false;
  }

  if (typeof user.name !== 'string') {
    return false;
  }

  return true;
};

function isEmail(str: string): boolean {
  // regex comes from https://www.w3resource.com/javascript/form/email-validation.php
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
}
