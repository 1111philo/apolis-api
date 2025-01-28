import { db, event } from '#src/utils'

export const updateGuestServiceStatus = async () => {
    const { status, slot_id, guest_id, service_id } = event.body;
    await db.connect();
    await db.query({
        text: `UPDATE "guest_services" SET "status"=$1, "slot_id"=$2 WHERE "guest_id"=$3 AND "service_id"=$4`,
        values: [status, slot_id, guest_id, service_id],
    });
    await db.clean();
    return { success: true };
}