import { db, event } from '#src/utils'

export const getGuestData = async () => {
    const { guest_id } = event.body;

    await db.connect();
    const row = (await db.query({
        text: `
            SELECT g.*, g.dob::text,
            jsonb_agg(DISTINCT to_jsonb(gn.*)) FILTER (WHERE gn.notification_id IS NOT NULL) as guest_notifications,
            jsonb_agg(DISTINCT to_jsonb(s.*)) FILTER (WHERE s.service_id IS NOT NULL) as guest_services
            FROM "guests" g
            LEFT JOIN "guest_notifications" gn ON gn.guest_id = g.guest_id
            LEFT JOIN "guest_services" s ON s.guest_id = g.guest_id 
            WHERE g.guest_id = $1
            GROUP BY g.guest_id
        `,
        values: [guest_id],
    })).rows.map(row => ({
        ...row,
        guest_notifications: row?.guest_notifications ?? [],
        guest_services: row?.guest_services ?? [],
    }))?.[0];
    await db.clean();
    return row
}