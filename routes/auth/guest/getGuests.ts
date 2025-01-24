import { db, event } from '#src/utils'

export const getGuests = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `SELECT * FROM "guests"`,
        values: [],
    })).rows;
    await db.clean();
    return rows;
}