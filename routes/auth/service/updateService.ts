import { db, event } from '#src/utils'

export const updateService = async () => {
    const { name, quota, service_id } = event.body;
    await db.connect();
    const rows = (await db.query({
        text: `UPDATE "services" SET "name"=$1, "quota"=$2, "updated_at"=$3 WHERE "service_id"=$4`,
        values: [name, quota, new Date().toISOString(), service_id],
    })).rows;
    await db.clean();
    return rows;
}