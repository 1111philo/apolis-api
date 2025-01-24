import { db, event } from '#src/utils'

export const getUsers = async () => {
    await db.connect();
    let response;
    response = (await db.query({
        text: `SELECT * FROM "users"`,
        values: [],
    })).rows;
    await db.clean();
    return response;
}