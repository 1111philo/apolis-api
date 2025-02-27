import { cognito, db, event } from '#src/utils';
import { randomUUID } from 'crypto';

export const addUser = async () => {
  await db.connect();
  if (!event.body.email || !event.body.name || !event.body.role) {
    return {
      error: `The following fields are required: email, name, role`,
    };
  }

  const username = randomUUID();

  const { User } = await cognito.adminCreateUser({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      { Name: 'email', Value: event.body.email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'name', Value: event.body.name },
      { Name: 'profile', Value: event.body.role },
    ],
  });
  await cognito.adminSetUserPassword({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    Permanent: true,
    Password: event.body.password ?? '123456',
  });
  const sub = User.Attributes.find((obj) => obj.Name === 'sub')?.Value;
  const user = (
    await db.query({
      text: `INSERT INTO "users" ("sub", "email", "name", "role") VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [sub, event.body.email, event.body.name, event.body.role],
    })).rows?.[0]
  await db.clean();
  return { user, user_id: user.user_id };
};
