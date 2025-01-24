import { db, event } from '#src/utils'

export const deleteGuest = async () => {
    const { guest_id } = event.queryStringParameters;
    await db.connect();
    await db.query({
        text: `DELETE FROM "guests" WHERE "guest_id"=$1`,
        values: [guest_id],
    });
    await db.clean();
    return { success: true };
}