import { db, event } from '#src/utils'

export const updateGuestServiceStatus = async () => {
    const { status, guest_id, service_id } = event.body;
    await db.connect();
    await db.query({
        text: `UPDATE "guest_services" SET "status"=$1 WHERE "guest_id"=$2 AND "service_id"=$3`,
        values: [status, guest_id, service_id],
    });
    await db.clean();
    return { success: true };
}