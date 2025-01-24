import { db, event } from '#src/utils'

export const getVisits = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `SELECT * FROM "visits"`,
        values: [],
    })).rows;
    await db.clean();
    return rows;
}