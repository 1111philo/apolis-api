import { db, event } from '#src/utils'

export const serviceGuestsCompleted = async () => {
    const service_id = event.body?.service_id;
    await db.connect();
    const rows = (await db.query({
        text: `
            SELECT "guests".*, "guest_services".* FROM "guests" 
            INNER JOIN "guest_services" ON "guests"."guest_id" = "guest_services"."guest_id"
            WHERE "guest_services"."status"=$1 AND ($2::int IS NULL or "guest_services"."service_id"=$2)
        `,
        values: ['Completed', service_id],
    })).rows;
    await db.clean();
    return rows;
}