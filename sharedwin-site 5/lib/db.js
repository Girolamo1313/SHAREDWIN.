import pg from "pg";

// One pool per server instance (re-used across hot reloads and warm serverless invocations).
const g = globalThis;
if (!g.__swPool) {
  g.__swPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    max: 5,
  });
}
export const pool = g.__swPool;

// All SQL uses parameters ($1, $2...) => no SQL injection.
export const query = (text, params) => pool.query(text, params);

export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
