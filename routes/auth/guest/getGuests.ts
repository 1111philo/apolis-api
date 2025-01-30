import { db, event } from "#src/utils";

export const getGuests = async () => {
  const limit = event.body?.limit ?? 10;
  const offset = event.body?.offset ?? 0;
  let first_name = event.body?.first_name && `%${event.body.first_name}%`;
  let last_name = event.body?.last_name && `%${event.body.last_name}%`;
  let dob = event.body?.dob && `%${event.body.dob}%`;
  let guest_id = event.body?.guest_id;
  const query = event.body?.query && `%${event.body.query}%`;
  const sort = event.body?.sort === "desc" ? "DESC" : "ASC";
  const sortBy = event.body?.sortBy ?? "id";

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
            SELECT g.*, g.dob::text, CAST(COUNT(*) OVER() AS INT) AS total
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
            ORDER BY $7 $8
            LIMIT $5 OFFSET $6
        `,
      values: [
        first_name,
        last_name,
        dob,
        guest_id,
        limit,
        offset,
        sortBy,
        sort,
      ],
    })
  ).rows;
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
