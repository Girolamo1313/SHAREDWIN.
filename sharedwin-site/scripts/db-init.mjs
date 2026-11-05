import fs from "node:fs";
import pg from "pg";
const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl });
await client.connect();
await client.query(fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
await client.end();
console.log("Schema ready.");
