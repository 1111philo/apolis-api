import { db, event } from '#src/utils';

export const updateService = async () => {
  const { name, quota, queueable, service_id } = event.body;
  await db.connect();
  const service = (await db.query({
    text: `UPDATE "services" SET "name"=$1, "quota"=$2, "queueable"=$3,"updated_at"=$4 WHERE "service_id"=$5 RETURNING *`,
    values: [name, quota, queueable, new Date().toISOString(), service_id],
  })).rows?.[0];
  await db.clean();
  return { success: true, service };
};
