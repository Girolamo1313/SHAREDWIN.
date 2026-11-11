import { z } from "zod";
import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { handler, readJson, json, HttpError } from "@/lib/api";

const schema = z.object({
  current: z.string().min(1, "Enter your current password.").max(72),
  next: z.string().min(8, "New password: 8 characters minimum").max(72),
});

export const POST = handler(async (req, _ctx, user) => {
  const { current, next } = schema.parse(await readJson(req));
  const row = (await query("select password_hash from users where id = $1", [user.id])).rows[0];
  if (!row || !(await verifyPassword(current, row.password_hash))) throw new HttpError(400, "Current password is wrong.");
  await query("update users set password_hash = $2 where id = $1", [user.id, await hashPassword(next)]);
  return json({ ok: true });
});
