import { db, event } from '#src/utils'

export const serviceSlots = async () => {
    const { service_id } = event.body;
    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT * FROM "guest_services" WHERE "service_id"=$1 AND "status"=$2
        `,
        values: [service_id, 'Slotted'],
    })).rows;
    await db.clean();
    return rows;
}