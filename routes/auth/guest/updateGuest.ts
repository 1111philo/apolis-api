import { db, event } from '#src/utils'

export const updateGuest = async () => {
    const { first_name, last_name, dob, case_manager, guest_id } = event.body;
    await db.connect();
    const rows = (await db.query({
        text: `UPDATE "guest" SET "first_name"=$1, "last_name"=$2, "dob"=$3, "case_manager"=$4, "updated_at"=$5 WHERE "guest_id"=$6`,
        values: [first_name, last_name, dob, case_manager, new Date().toISOString(), guest_id],
    })).rows;
    await db.clean();
    return rows;
}