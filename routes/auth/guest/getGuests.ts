import { db, event } from '#src/utils'

export const getGuests = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT CAST(COUNT(g.guest_id) AS INT) AS total_guests, g.*,
            jsonb_agg(DISTINCT to_jsonb(gn.*)) FILTER (WHERE gn.notification_id IS NOT NULL) as notifications,
            jsonb_agg(DISTINCT to_jsonb(s.*)) FILTER (WHERE s.service_id IS NOT NULL) as services
            FROM "guests" g
            LEFT JOIN "guest_notifications" gn ON gn.guest_id = g.guest_id
            LEFT JOIN "services" s ON s.guest_id = g.guest_id 
            GROUP BY g.guest_id;
        `,
        values: [],
    })).rows.map(row => ({
        ...row,
        notifications: row?.notifications ?? [],
        services: row?.services ?? [],
    }));
    await db.clean();
    return rows;
}