import { db, event } from '#src/utils'

export const getVisits = async () => {
    const limit = event.body?.limit ?? 10;
    const offset = event.body?.offset ?? 0;
    const fromDate = event.body?.fromDate ?? '2000-01-01';
    const toDate = event.body?.toDate ?? '2200-01-01';

    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT v.*, CAST(COUNT(v.visit_id) as INT) as total 
            FROM visits as v 
            WHERE v.created_at > $1 AND v.created_at < $2 
            GROUP BY v.visit_id
            LIMIT $3 OFFSET $4
        `,
        values: [fromDate, toDate, limit, offset],
    })).rows;
    await db.clean();
    return {
        rows: rows?.map(row => {
            delete row.total;
            return row;
        }),
        total: rows?.[0]?.total ?? 0,
        limit,
        offset,
    };
}