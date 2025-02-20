import { db, event } from '#src/utils';

export const serviceGuestsQueued = async () => {
  const service_id = event.body?.service_id;
  await db.connect();
  const rows = (
    await db.query({
      text: `
        WITH guests_with_notifications AS (
          SELECT DISTINCT guest_id, true as has_notification
          FROM guest_notifications
          WHERE status = 'Active'
        )

        SELECT "guests".*, "guest_services".*, "guests_with_notifications"."has_notification"
        FROM "guests"
        INNER JOIN "guest_services" ON "guests"."guest_id" = "guest_services"."guest_id"
        LEFT JOIN "guests_with_notifications" ON "guests"."guest_id" = "guests_with_notifications"."guest_id"
        WHERE "guest_services"."status"=$1
        AND ($2::int IS NULL or "guest_services"."service_id"=$2)
      `,
      values: ['Queued', service_id],
    })
  ).rows;
  await db.clean();
  return rows;
};
