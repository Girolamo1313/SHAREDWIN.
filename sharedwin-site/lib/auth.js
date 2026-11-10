import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export const COOKIE_NAME = "sw_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set (32+ characters).");
  return new TextEncoder().encode(s);
}

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export async function createSessionToken(userId) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export const sessionCookie = (token) => ({
  name: COOKIE_NAME,
  value: token,
  httpOnly: true,                       // not readable by JS => protects against XSS token theft
  sameSite: "lax",                      // basic CSRF protection
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
});

/** Current user (or null). Reads the HttpOnly cookie, verifies the JWT, loads the user. */
export async function getUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const r = await query(
      "select id, username, email, balance_cents, is_admin, created_at, avatar from users where id = $1",
      [payload.sub]
    );
    return r.rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const u = await getUser();
  if (!u) redirect("/auth");
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (!u.is_admin) redirect("/dashboard");
  return u;
}
