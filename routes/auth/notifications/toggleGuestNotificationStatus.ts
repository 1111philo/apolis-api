import { db, event } from '#src/utils'

export const toggleGuestNotificationStatus = async () => {
    const { notification_id } = event.body;
    await db.connect();
    const row = (await db.query({
        text: `SELECT "status" FROM "guest_notifications" WHERE "notification_id"=$1`,
        values: [notification_id],
    })).rows?.[0];

    if (!row) {
        return {
            error: `Notification ID not found`
        }
    }

    const newStatus = row.status === 'Active' ? 'Archived' : row.status === 'Archived' ? 'Active' : row.status;
    await db.query({
        text: `UPDATE "guest_notifications" SET "status"=$1 WHERE "notification_id"=$2`,
        values: [newStatus, notification_id],
    });
    await db.clean();
    return { success: true };
}