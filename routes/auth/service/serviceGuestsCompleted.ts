import { db, event } from '#src/utils'

export const serviceGuestsCompleted = async () => {
    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT "guests".* FROM "guests" 
            INNER JOIN "guest_services" ON "guests"."guest_id" = "guest_services"."guest_id"
            WHERE "guest_services"."status"=$1
        `,
        values: ['Completed'],
    })).rows;
    await db.clean();
    return rows;
}