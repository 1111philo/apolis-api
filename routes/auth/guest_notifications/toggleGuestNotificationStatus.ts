import { db, event } from '#src/utils'

export const toggleGuestNotificationStatus = async () => {
    const { notification_id } = event.body;
    await db.connect();
    const status = (await db.query({
        text: `SELECT "status" FROM "guest_notifications" WHERE "notification_id"=$1`,
        values: [notification_id],
    })).rows?.[0]?.status;
    const newStatus = status === 'Active' ? 'Archived' : status === 'Archived' ? 'Active' : status;
    const rows = (await db.query({
        text: `UPDATE "guest_notifications" SET "status"=$1 WHERE "notification_id"=$1`,
        values: [newStatus, notification_id],
    })).rows;
    await db.clean();
    return rows;
}