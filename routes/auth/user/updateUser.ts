import { cognito, db, event } from '#src/utils'

export const updateUser = async () => {
    await db.connect();
    let response;
    await cognito.adminUpdateUserAttributes({
        UserAttributes: [
            { Name: 'email', Value: event.body.email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'name', Value: event.body.name },
            { Name: 'profile', Value: event.body.role },
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: event.claims['cognito:username']
    });
    response = (await db.query({
        text: `UPDATE "users" SET "email"=$1, "name"=$2, "role"=$3 WHERE "user_id"=$4`,
        values: [event.body.email, event.body.name, event.body.role, event.body.user_id],
    })).rows;
    await db.clean();
    return response;
}