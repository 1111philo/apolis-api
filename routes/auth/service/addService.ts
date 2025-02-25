import { db, event } from '#src/utils'

export const addService = async () => {
    const { name, quota } = event.body;
    await db.connect();
    const service = (await db.query({
        text: `INSERT INTO "services" ("name", "quota") VALUES ($1, $2) RETURNING *`,
        values: [name, quota],
    })).rows?.[0];
    await db.clean();
    return { service, service_id: service.service_id};
}
