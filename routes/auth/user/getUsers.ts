import { db, event } from "#src/utils";

export const getUsers = async () => {
  const limit = event.queryStringParameters?.limit ?? 10;
  const offset = event.queryStringParameters?.offset ?? 0;
  const sort = event.queryStringParameters?.sort === "desc" ? "DESC" : "ASC";
  const sortBy = event.queryStringParameters?.sortBy ?? "id";

  await db.connect();
  const rows = (
    await db.query({
      text: `SELECT * FROM "users" ORDER BY $3 $4 LIMIT $1 OFFSET $2`,
      values: [limit, offset, sortBy, sort],
    })
  ).rows;
  await db.clean();
  return rows;
};
