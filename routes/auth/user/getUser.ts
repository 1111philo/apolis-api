import { db, event } from '#src/utils';

export const getUser = async () => {
  const user_id = event.body?.user_id;

  if (!user_id) {
    return { error: 'User ID is required' };
  }

  await db.connect();
  const user = (
    await db.query({
      text: `SELECT * FROM "users" WHERE "user_id" = $1`,
      values: [user_id],
    })
  ).rows?.[0];
  await db.clean();

  if (!user) {
    return { error: 'User not found' };
  }

  return user;
};
