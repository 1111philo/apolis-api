import { db, event } from '#src/utils';

export const getUser = async () => {
  const sub = event.body?.sub;

  if (!sub) {
    return { error: 'User sub is required' };
  }

  await db.connect();
  const user = (
    await db.query({
      text: `SELECT * FROM "users" WHERE "sub" = $1`,
      values: [sub],
    })
  ).rows?.[0];
  await db.clean();

  if (!user) {
    return { error: 'User not found' };
  }

  return user;
};
