import { db, event } from '#src/utils'

export const getGuestNotifications = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `SELECT * FROM "guest_notifications"`,
        values: [],
    })).rows;
    await db.clean();
    return rows;
}