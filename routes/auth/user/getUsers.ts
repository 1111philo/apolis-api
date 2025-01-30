import { db, event } from "#src/utils";

export const getUsers = async () => {
  const limit = event.queryStringParameters?.limit ?? 10;
  const offset = event.queryStringParameters?.page ?? 0;

  await db.connect();
  const rows = (
    await db.query({
      text: `SELECT * FROM "users" LIMIT $1 OFFSET $2`,
      values: [limit, offset],
    })
  ).rows;
  await db.clean();
  return rows;
};
