import { event, db } from "#src/utils";

export const postConfirmationConfirmSignUp = async () => {
    const { sub, email, name } = event.request.userAttributes;
    await db.connect();
    await db.query({
        text: `INSERT INTO "users" ("sub", "email", "name") VALUES ($1, $2, $3)`,
        values: [sub, email, name],
    });
    await db.clean();
    return event;
}