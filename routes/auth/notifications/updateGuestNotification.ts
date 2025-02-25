import { db, event } from '#src/utils'

export const updateGuestNotification = async () => {
    const { status, message, notification_id } = event.body;
    await db.connect();
    const notification = (await db.query({
        text: `UPDATE "guest_notifications" SET "status"=$1, "message"=$2, "updated_at"=$3 WHERE "notification_id"=$4 RETURNING *`,
        values: [status, message, new Date().toISOString(), notification_id],
    })).rows?.[0];
    await db.clean();
    return { success: true, notification };
}
