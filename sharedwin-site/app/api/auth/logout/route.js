import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
import { handler } from "@/lib/api";

export const POST = handler(async () => {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  return res;
}, { auth: false });
