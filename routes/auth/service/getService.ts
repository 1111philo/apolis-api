import { db, event } from '#src/utils'

export const getService = async () => {
    const { service_id } = event.body;

    await db.connect();
    const row = (await db.query({
        text: `SELECT s.* FROM "services" g WHERE s.service_id=$1`,
        values: [service_id],
    })).rows?.[0];
    await db.clean();

    return row;
}