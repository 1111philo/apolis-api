import { db, event } from '#src/utils'

export const getServices = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `SELECT * FROM "services"`,
        values: [],
    })).rows;
    await db.clean();
    return rows;
}