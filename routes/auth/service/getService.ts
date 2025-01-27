import { db, event } from '#src/utils'

export const getService = async () => {
    await db.connect();
    const row = (await db.query({
        text: `SELECT * FROM "services" WHERE "service_id"=$1`,
        values: [event.body.service_id],
    })).rows?.[0];
    await db.clean();
    return row;
}