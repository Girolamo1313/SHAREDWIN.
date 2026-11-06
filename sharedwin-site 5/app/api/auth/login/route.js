import { z } from "zod";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, createSessionToken, sessionCookie } from "@/lib/auth";
import { handler, readJson, HttpError } from "@/lib/api";

const schema = z.object({ login: z.string().trim().min(3).max(120), password: z.string().min(1).max(72) });

export const POST = handler(async (req) => {
  const { login, password } = schema.parse(await readJson(req));
  const r = await query(
    "select id, password_hash from users where username_lower = lower($1) or email_lower = lower($1)",
    [login]
  );
  const u = r.rows[0];
  // Same message for unknown user / wrong password (no account enumeration).
  if (!u || !(await verifyPassword(password, u.password_hash))) throw new HttpError(401, "Wrong name or password.");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(await createSessionToken(u.id)));
  return res;
}, { auth: false });
