import { db, event } from '#src/utils'

export const addService = async () => {
    const { name, quota } = event.body;
    await db.connect();
    const service_id = (await db.query({
        text: `INSERT INTO "services" ("name", "quota") VALUES ($1, $2) RETURNING "service_id"`,
        values: [name, quota],
    })).rows?.[0]?.service_id;
    await db.clean();
    return { service_id };
}