import { db, event } from '#src/utils'

export const users = async () => {
    await db.connect();
    let response;
    if (event.httpMethod === 'GET') {
        response = (await db.query({
            text: `SELECT * FROM "users"`,
            values: [],
        })).rows;
    }
    await db.clean();
    return response;
}