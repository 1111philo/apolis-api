import {
  db,
  event,
  extractPaginationParams,
  extractSortParams,
} from '#src/utils';

const allowedSortFields = ['guest_id', 'dob', 'first_name', 'last_name'];
const allowedSortDirections = ['ASC', 'DESC'];

export const getGuestsData = async () => {
  const defaultSortCol = 'guest_id';
  const { limit, offset } = extractPaginationParams(event);
  const first_name = event.body?.first_name ?? '%%';
  const last_name = event.body?.last_name ?? '%%';
  const dob = event.body?.dob ?? '%%';
  const guest_id = event.body?.guest_id ?? '%%';
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
      text: `
            SELECT g.*, g.dob::text, CAST(COUNT(g.guest_id) AS INT) AS total,
            jsonb_agg(DISTINCT to_jsonb(gn.*)) FILTER (WHERE gn.notification_id IS NOT NULL) as guest_notifications,
            jsonb_agg(DISTINCT to_jsonb(s.*)) FILTER (WHERE s.service_id IS NOT NULL) as guest_services
            FROM "guests" g
            LEFT JOIN "guest_notifications" gn ON gn.guest_id = g.guest_id
            LEFT JOIN "guest_services" s ON s.guest_id = g.guest_id
            WHERE g.first_name ILIKE $1 AND g.last_name ILIKE $2 OR g.dob::text ILIKE $3 OR g.guest_id::text LIKE $4
            GROUP BY g.guest_id
            ORDER BY ${sanitizedSortBy} ${sanitizedSort}
            LIMIT $5 OFFSET $6
        `,
      values: [first_name, last_name, dob, guest_id, limit, offset],
    })
  ).rows.map((row) => ({
    ...row,
    guest_notifications: row?.guest_notifications ?? [],
    guest_services: row?.guest_services ?? [],
  }));
  await db.clean();
  return {
    rows: rows?.map((row) => {
      delete row.total;
      return row;
    }),
    total: rows?.[0]?.total ?? 0,
    limit,
    offset,
  };
};
