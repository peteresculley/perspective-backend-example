export type User = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};

export type UserWithId = User & {
  _id: string
};
