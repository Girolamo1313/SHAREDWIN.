import { z } from "zod";
import { NextResponse } from "next/server";
import { tx } from "@/lib/db";
import { hashPassword, createSessionToken, sessionCookie } from "@/lib/auth";
import { handler, readJson, HttpError } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { WELCOME_BONUS_CENTS } from "@/lib/rules";

const schema = z.object({
  username: z.string().trim().regex(/^[A-Za-z0-9_-]{3,16}$/, "Username: 3-16 letters, digits, _ or -"),
  email: z.string().trim().email("Invalid email").max(120),
  password: z.string().min(8, "Password: 8 characters minimum").max(72),
});

export const POST = handler(async (req) => {
  const { username, email, password } = schema.parse(await readJson(req));
  const isAdmin = (process.env.ADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    .includes(email.toLowerCase());
  const passwordHash = await hashPassword(password);

  let userId;
  try {
    userId = await tx(async (c) => {
      const r = await c.query(
        "insert into users (username, email, password_hash, is_admin) values ($1, $2, $3, $4) returning id",
        [username, email, passwordHash, isAdmin]
      );
      await credit(c, r.rows[0].id, WELCOME_BONUS_CENTS, "bonus", "Welcome bonus");
      return r.rows[0].id;
    });
  } catch (e) {
    if (e?.code === "23505") throw new HttpError(409, "Username or email already taken.");
    throw e;
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(await createSessionToken(userId)));
  return res;
}, { auth: false });
