import ServerlessClient from 'serverless-postgres';

const ssl =
  process.env.NODE_ENV === 'development'
    ? false // local dev should not use ssl
    : { rejectUnauthorized: false };

export const db = new ServerlessClient({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl,
});
