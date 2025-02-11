import { db, event } from '#src/utils';

export const deleteServiceData = async () => {
  const { service_id } = event.body;
  await db.connect();
  await db.query({
    text: `DELETE FROM "guest_services" WHERE "service_id"=$1`,
    values: [service_id],
  });
  await db.query({
    text: `
            UPDATE "visits"
            SET "service_ids" = (
                SELECT COALESCE(jsonb_agg(value), '[]'::jsonb)
                FROM jsonb_array_elements("service_ids") value
                WHERE value::integer != $1
            )
            WHERE service_ids @> jsonb_build_array($1::int)
        `,
    values: [service_id],
  });
  await db.query({
    text: `DELETE FROM "services" WHERE "service_id"=$1`,
    values: [service_id],
  });
  await db.clean();
  return { success: true };
};
