export const sql = {
    formatFilter: (attribute) => attribute ? `%${attribute}%` : null,
    formatArrayResponse: ({ rows, limit = 10, offset = 0 }) => ({
        rows: rows.map(({ total, ...row }) => row),
        total: rows[0]?.total ?? 0,
        limit,
        offset,
    }),
}