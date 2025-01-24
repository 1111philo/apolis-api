import { cognito, db, event } from '#src/utils'
import { randomUUID } from 'crypto'

export const addUser = async () => {
    await db.connect();
    let response;
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
    const sub = User.Attributes.find(obj => obj.Name === 'sub')?.Value;
    response = (await db.query({
        text: `INSERT INTO "users" ("sub", "email", "name") VALUES ($1, $2, $3)`,
        values: [sub, event.body.email, event.body.name],
    })).rows;
    await db.clean();
    return response;
}