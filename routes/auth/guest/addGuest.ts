import { db, event } from '#src/utils'

export const addGuest = async () => {
    const { first_name, last_name, dob, case_manager } = event.body;
    if (!(first_name && last_name) || !(first_name && dob) || !(last_name && dob)) {
        return { error: `You must provide at least 2 of the following: first_name, last_name, dob` }
    }
    await db.connect();
    const guest_id = (await db.query({
        text: `INSERT INTO "guests" ("first_name", "last_name", "dob", "case_manager") VALUES ($1, $2, $3, $4) RETURNING "guest_id"`,
        values: [first_name, last_name, dob, case_manager],
    })).rows?.[0]?.guest_id;
    await db.clean();
    return { guest_id };
}