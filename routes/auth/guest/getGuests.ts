import {
  db,
  event,
  extractPaginationParams,
  extractSortParams,
} from '#src/utils';

const allowedSortFields = ['guest_id', 'dob', 'first_name', 'last_name'];
const allowedSortDirections = ['ASC', 'DESC'];

export const getGuests = async () => {
  const defaultSortCol = allowedSortFields[0];
  const { limit, offset } = extractPaginationParams(event);
  let first_name = event.body?.first_name && `%${event.body.first_name}%`;
  let last_name = event.body?.last_name && `%${event.body.last_name}%`;
  let dob = event.body?.dob && `%${event.body.dob}%`;
  let guest_id = event.body?.guest_id;
  const query = event.body?.query && `%${event.body.query}%`;
  const { sortBy, sort } = extractSortParams(event, defaultSortCol);

  // PostgreSQL injection prevention since we need to directly interpolate the sortBy
  const sanitizedSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : defaultSortCol;
  const sanitizedSort = allowedSortDirections.includes(sort.toUpperCase())
    ? sort.toUpperCase()
    : 'ASC';

  if (query) {
    first_name = query;
    last_name = query;
    dob = query;
    guest_id = query;
  }

  await db.connect();
  const rows = (
    await db.query({
      text: `
            SELECT g.*, g.dob::text, COUNT(*) OVER()::int as total
            FROM "guests" g
            WHERE (
                CASE
                    WHEN $1::text IS NOT NULL OR $2::text IS NOT NULL OR $3::text IS NOT NULL THEN
                        ($1::text IS NULL OR g.first_name ILIKE $1)
                        OR ($2::text IS NULL OR g.last_name ILIKE $2)
                        OR ($3::text IS NULL OR g.dob::text ILIKE $3)
                        OR ($4::text IS NULL OR g.guest_id::text ILIKE $4)
                    ELSE TRUE
                END
            )
            LIMIT $5 OFFSET $6
        `,
      values: [
        first_name,
        last_name,
        dob,
        guest_id,
        limit,
        offset,
      ],
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
