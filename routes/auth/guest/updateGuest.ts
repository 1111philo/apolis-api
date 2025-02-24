import { db, event } from '#src/utils'

export const updateGuest = async () => {
    const { first_name, last_name, dob, case_manager, guest_id } = event.body;
    await db.connect();
    const guest = (await db.query({
        text: `UPDATE "guests" SET "first_name"=$1, "last_name"=$2, "dob"=$3, "case_manager"=$4, "updated_at"=$5 WHERE "guest_id"=$6 RETURNING *`,
        values: [first_name, last_name, dob, case_manager, new Date().toISOString(), guest_id],
    })).rows?.[0];
    await db.clean();
    return { success: true, guest };
}
