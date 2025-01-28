import { cognito, db, event } from '#src/utils'

export const updateUser = async () => {
    const { user_id, email, name, role, password } = event.body;

    await db.connect();

    const originalEmail = (await db.query({
        text: `SELECT "email" FROM "users" WHERE "user_id"=$1`,
        values: [user_id],
    })).rows?.[0]?.email;

    await cognito.adminUpdateUserAttributes({
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'name', Value: name },
            { Name: 'profile', Value: role },
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: originalEmail,
    });

    await db.query({
        text: `UPDATE "users" SET "email"=$1, "name"=$2, "role"=$3 WHERE "user_id"=$4`,
        values: [email, name, role, user_id],
    });

    if (password) {
        await cognito.adminSetUserPassword({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            Permanent: true,
            Password: password ?? '123456',
        });
    }

    await db.clean();

    return { success: true };
}