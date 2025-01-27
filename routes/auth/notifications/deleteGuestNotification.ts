import { db, event } from '#src/utils'

export const deleteGuestNotification = async () => {
    await db.connect();
    await db.query({
        text: `DELETE FROM "guest_notifications" WHERE "notification_id"=$1`,
        values: [event.body.notification_id],
    });
    await db.clean();
    return { success: true };
}