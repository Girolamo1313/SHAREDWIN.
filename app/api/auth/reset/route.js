import crypto from "node:crypto";
import { z } from "zod";
import { tx } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { handler, readJson, json, HttpError } from "@/lib/api";

const schema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(8, "Password: 8 characters minimum").max(72),
});

export const POST = handler(async (req) => {
  const { token, password } = schema.parse(await readJson(req));
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const passwordHash = await hashPassword(password);
  await tx(async (c) => {
    const r = await c.query("select id, user_id from password_resets where token_hash = $1 and used_at is null and expires_at > now() for update", [hash]);
    if (!r.rows[0]) throw new HttpError(400, "This link is invalid or has expired.");
    await c.query("update users set password_hash = $2 where id = $1", [r.rows[0].user_id, passwordHash]);
    await c.query("update password_resets set used_at = now() where user_id = $1 and used_at is null", [r.rows[0].user_id]);
  });
  return json({ ok: true });
}, { auth: false });
