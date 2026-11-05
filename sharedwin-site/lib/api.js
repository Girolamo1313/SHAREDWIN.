import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const json = (data, status = 200) => NextResponse.json(data, { status });

/** Wraps a route handler: turns HttpError / validation / DB errors into clean JSON responses. */
export function handler(fn, { auth = true, admin = false } = {}) {
  return async (req, ctx) => {
    try {
      if (req.method !== "GET") {
        // CSRF defence in depth: reject cross-origin browser requests.
        const origin = req.headers.get("origin");
        if (origin) {
          let host = "";
          try { host = new URL(origin).host; } catch {}
          if (host !== req.headers.get("host")) throw new HttpError(403, "Bad origin.");
        }
      }
      let user = null;
      if (auth) {
        user = await getUser();
        if (!user) throw new HttpError(401, "Please log in.");
        if (admin && !user.is_admin) throw new HttpError(403, "Admins only.");
      }
      return await fn(req, ctx, user);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      if (e?.name === "ZodError") return json({ error: e.issues?.[0]?.message || "Invalid input." }, 400);
      if (e?.code === "23514") return json({ error: "Insufficient balance." }, 402); // check_violation
      console.error(e);
      return json({ error: "Server error." }, 500);
    }
  };
}

export async function readJson(req) {
  try { return await req.json(); } catch { throw new HttpError(400, "Invalid JSON body."); }
}
