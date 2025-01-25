import { db, event } from '#src/utils'

export const deleteUser = async () => {
    await db.connect();
    await db.query({
        text: `DELETE FROM "users" WHERE "user_id"=$1`,
        values: [event.body.user_id],
    });
    await db.clean();
    return { success: true };
}