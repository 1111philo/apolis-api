import {
  db,
  event,
  extractPaginationParams,
  extractSortParams,
} from '#src/utils';

const allowedSortFields = ['user_id', 'role', 'name', 'email'];
const allowedSortDirections = ['ASC', 'DESC'];

export const getUsers = async () => {
  const defaultSortCol = allowedSortFields[0];
  const { limit, offset } = extractPaginationParams(event);
  const { sortBy, sort } = extractSortParams(event, defaultSortCol);

  // PostgreSQL injection prevention since we need to directly interpolate the sortBy
  const sanitizedSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : defaultSortCol;
  const sanitizedSort = allowedSortDirections.includes(sort.toUpperCase())
    ? sort.toUpperCase()
    : 'ASC';

  await db.connect();
  const rows = (
    await db.query({
      text: `SELECT "users".*, COUNT(*) OVER()::int as total FROM "users" ORDER BY ${sanitizedSortBy} ${sanitizedSort} LIMIT $1 OFFSET $2`,
      values: [limit, offset],
    })
  ).rows;
  await db.clean();
  return {
    total: rows?.[0]?.total ?? 0,
    rows: rows?.map((row) => {
      delete row.total;
      return row;
    }),
    limit,
    offset,
  };
};
