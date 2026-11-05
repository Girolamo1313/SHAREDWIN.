import fs from "node:fs";
import pg from "pg";
const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl });
await client.connect();
const { rows } = await client.query("select count(*)::int as n from matches");
if (rows[0].n > 0) {
  console.log("Matches already exist, skipping seed.");
} else {
  await client.query(fs.readFileSync(new URL("../db/seed.sql", import.meta.url), "utf8"));
  console.log("Demo matches created.");
}
await client.end();
