import crypto from "node:crypto";
import { z } from "zod";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { handler, readJson, json, HttpError } from "@/lib/api";

const schema = z.object({ username: z.string().trim().min(3).max(120) });
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

// Admin tool: gives a player a temporary password (to send to them by hand).
export const POST = handler(async (req) => {
  const { username } = schema.parse(await readJson(req));
  const u = (await query("select id, username from users where username_lower = lower($1) or email_lower = lower($1)", [username])).rows[0];
  if (!u) throw new HttpError(404, "No such player.");
  const bytes = crypto.randomBytes(10);
  let temp = "Tmp-";
  for (let i = 0; i < 10; i++) temp += ALPHABET[bytes[i] % ALPHABET.length];
  await query("update users set password_hash = $2 where id = $1", [u.id, await hashPassword(temp)]);
  return json({ ok: true, username: u.username, tempPassword: temp });
}, { admin: true });
