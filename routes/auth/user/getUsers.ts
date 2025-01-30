import {
  db,
  event,
  extractPaginationParams,
  extractSortParams,
} from "#src/utils";

export const getUsers = async () => {
  const { limit, offset } = extractPaginationParams(event);
  const { sortBy, sort } = extractSortParams(event);

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
