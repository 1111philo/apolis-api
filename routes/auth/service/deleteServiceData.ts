import { db, event } from '#src/utils'

export const deleteServiceData = async () => {
    const { service_id } = event.body;
    await db.connect();
    await db.query({
        text: `DELETE FROM "guests" WHERE "service_id"=$1`,
        values: [service_id],
    });
    await db.query({
        text: `
            UPDATE "visits"
            SET "service_ids" = (
                SELECT jsonb_agg(elem)
                FROM jsonb_array_elements("service_ids") elem
                WHERE elem::text != $1::text
            )
            WHERE "service_ids" @> $1::jsonb
        `,
        values: [service_id.toString()],
    });
    await db.clean();
    return { success: true };
}