import { db, event } from '#src/utils';

export const getUser = async () => {
  const { user_id, email } = event.body;

  if (!user_id && !email) {
    return { error: 'User ID or email is required' };
  }

  await db.connect();

  let user;
  if (user_id) {
    user = (
      await db.query({
        text: `SELECT * FROM "users" WHERE "user_id" = $1`,
        values: [user_id],
      })
    ).rows?.[0];
  } else if (email) {
    user = (
      await db.query({
        text: `SELECT * FROM "users" WHERE "email" = $1`,
        values: [email],
      })
    ).rows?.[0];
  }

  await db.clean();

  if (!user) {
    return { error: 'User not found' };
  }
  return user;
};
