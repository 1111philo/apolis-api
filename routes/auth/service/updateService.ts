import { db, event } from '#src/utils';

export const updateService = async () => {
  const { name, quota, queueable, service_id } = event.body;
  await db.connect();
  await db.query({
    text: `UPDATE "services" SET "name"=$1, "quota"=$2, "queueable"=$3,"updated_at"=$4 WHERE "service_id"=$5`,
    values: [name, quota, queueable, new Date().toISOString(), service_id],
  });
  await db.clean();
  return { success: true };
};
