import { db, event } from '#src/utils';

export const getUser = async () => {
  const {
    user_id,
    email,
    // ***Temp - `sub` is safe to remove
    // after App PR #233 is merged into main
    // https://github.com/1111philo/apolis-app/pull/233
    sub,
  } = event.body;

  if (!user_id && !email && !sub /* ***Temp */) {
    return { error: 'User ID or email is required' };
  }

  await db.connect();

  let user;
  // ***Temp - `sub`
  if (sub) {
    user = (
      await db.query({
        text: `SELECT * FROM "users" WHERE "sub" = $1`,
        values: [sub],
      })
    ).rows?.[0];
  } else if (user_id) {
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
