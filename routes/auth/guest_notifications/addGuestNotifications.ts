import { db, event } from '#src/utils'

export const addGuestNotifications = async () => {
    const { guest_id, message, status } = event.body;
    await db.connect();
    const notification_id = (await db.query({
        text: `INSERT INTO "guest_notifications" ("guest_id", "message", "status") VALUES ($1, $2, $3) RETURNING "notification_id"`,
        values: [guest_id, message, status],
    })).rows?.[0]?.notification_id;
    await db.clean();
    return { notification_id };
}