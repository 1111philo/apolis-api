import { db, event } from '#src/utils'

export const getGuestNotifications = async () => {
    const limit = event.body?.limit ?? 10;
    const offset = event.body?.offset ?? 0;
    const guest_id = event.body?.guest_id;
    const notification_id = event.body?.notification_id;
    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT COUNT(*) OVER()::int as total, gn.* FROM "guest_notifications" as gn
            WHERE gn."guest_id"=$1 OR gn."notification_id"=$2
            LIMIT $3 OFFSET $4`,
        values: [guest_id, notification_id, limit, offset],
    })).rows;
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