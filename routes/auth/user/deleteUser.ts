import { db, event } from '#src/utils'

export const deleteUser = async () => {
    await db.connect();
    let response;
    response = (await db.query({
        text: `DELETE FROM "users" WHERE "user_id"=$1`,
        values: [event.queryStringParameters.user_id],
    })).rows;
    await db.clean();
    return response;
}