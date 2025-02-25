import { db, event } from '#src/utils';

export const addGuest = async () => {
  const { first_name, last_name, dob, case_manager } = event.body;
  if (
    !(first_name && last_name) &&
    !(first_name && dob) &&
    !(last_name && dob)
  ) {
    return {
      error: `You must provide at least 2 of the following: first_name, last_name, dob`,
    };
  }

  // Prevent empty string for dob
  const sanitizedDob = dob === '' ? null : dob;

  await db.connect();
  const guest = (
    await db.query({
      text: `INSERT INTO "guests" ("first_name", "last_name", "dob", "case_manager") VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [first_name, last_name, sanitizedDob, case_manager],
    })
  ).rows?.[0];
  await db.clean();
  return { guest, guest_id: guest.guest_id };
};
