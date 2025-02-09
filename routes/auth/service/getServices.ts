import { db, event } from '#src/utils'

export const getServices = async () => {
    const limit = event.body?.limit ?? 10;
    const offset = event.body?.offset ?? 0;
    const name = event.body?.name && `%${event.body.name}%`;
    const service_id = event.body?.service_id;

    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT s.*, COUNT(*) OVER()::int as total
            FROM "services" s
            WHERE ($1::text IS NULL OR s.name ILIKE $1) AND ($2::int IS NULL OR s.service_id = $2)
            LIMIT $3 OFFSET $4
        `,
        values: [name, service_id, limit, offset],
    })).rows.map(row => ({
        ...row,
    }));
    await db.clean();
    return {
        total: rows?.[0]?.total ?? 0,
        rows: rows?.map(row => {
            delete row.total;
            return row;
        }),
        limit,
        offset,
    };
}