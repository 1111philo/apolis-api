import { db, event } from '#src/utils'

export const getGuestsData = async () => {
    const limit = event.body?.limit ?? 10;
    const offset = event.body?.offset ?? 0;
    const first_name = event.body?.first_name ?? '%%';
    const last_name = event.body?.last_name ?? '%%';
    const dob = event.body?.dob ?? '%%';
    const guest_id = event.body?.guest_id ?? '%%';

    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT g.*, g.dob::text, CAST(COUNT(g.guest_id) AS INT) AS total,
            jsonb_agg(DISTINCT to_jsonb(gn.*)) FILTER (WHERE gn.notification_id IS NOT NULL) as guest_notifications,
            jsonb_agg(DISTINCT to_jsonb(s.*)) FILTER (WHERE s.service_id IS NOT NULL) as guest_services
            FROM "guests" g
            LEFT JOIN "guest_notifications" gn ON gn.guest_id = g.guest_id
            LEFT JOIN "guest_services" s ON s.guest_id = g.guest_id 
            WHERE g.first_name ILIKE $1 AND g.last_name ILIKE $2 OR g.dob::text ILIKE $3 OR g.guest_id::text LIKE $4
            GROUP BY g.guest_id
            LIMIT $5 OFFSET $6
        `,
        values: [first_name, last_name, dob, guest_id, limit, offset],
    })).rows.map(row => ({
        ...row,
        guest_notifications: row?.guest_notifications ?? [],
        guest_services: row?.guest_services ?? [],
    }));
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