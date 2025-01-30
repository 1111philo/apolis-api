import { db, event } from "#src/utils";

export const getUsers = async () => {
  const limit = event.queryStringParameters?.limit ?? 10;
  const offset = event.queryStringParameters?.page ?? 0;
  const sort = event.queryStringParameters?.sort === "desc" ? "DESC" : "ASC";
  const sortBy = event.queryStringParameters?.sortBy ?? "id";

  await db.connect();
  const rows = (
    await db.query({
      text: `SELECT * FROM "users" ORDER BY ${sortBy} ${sort} LIMIT $1 OFFSET $2`,
      values: [limit, offset],
    })
  ).rows;
  await db.clean();
  return rows;
};
