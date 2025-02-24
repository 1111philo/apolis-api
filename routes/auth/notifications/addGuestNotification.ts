import { db, event } from '#src/utils'

export const addGuestNotification = async () => {
    const { guest_id, message, status } = event.body;
    if (![null, 'Archived', 'Active'].includes(status)) {
        return { error: `Status must be one of the following: null, Archived, Active` }
    }
    await db.connect();
    const notification = (await db.query({
        text: `INSERT INTO "guest_notifications" ("guest_id", "message", "status") VALUES ($1, $2, $3) RETURNING *`,
        values: [guest_id, message, status],
    })).rows?.[0];
    await db.clean();
    return { notification, notification_id: notification.notification_id };
}
