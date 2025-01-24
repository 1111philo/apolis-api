import { db, event } from '#src/utils'

export const addVisit = async () => {
    const { guest_id, service_ids } = event.body;
    await db.connect();
    const visit_id = (await db.query({
        text: `INSERT INTO "visits" ("guest_id", "service_ids", "updated_at") VALUES ($1, $2, $3) RETURNING "visit_id"`,
        values: [guest_id, JSON.stringify(service_ids), new Date().toISOString()],
    })).rows?.[0]?.visit_id;
    const guest_service_ids = [];
    for (const service_id of service_ids) {
        const guest_service_id = (await db.query({
            text: `INSERT INTO "guest_services" ("guest_id", "service_id") VALUES ($1, $2) RETURNING "guest_service_id"`,
            values: [guest_id, service_id],
        })).rows?.[0]?.guest_service_id;
        guest_service_ids.push(guest_service_id);
    }
    await db.clean();
    return { visit_id, guest_service_ids };
}