import { z } from "zod";
import { query } from "@/lib/db";
import { handler, readJson, json, HttpError } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(60),
  email: z.string().trim().email("Please enter a valid e-mail.").max(120),
  message: z.string().trim().min(5, "Message is too short.").max(1500, "Message is too long (1500 characters max)."),
});

export const POST = handler(async (req) => {
  const d = schema.parse(await readJson(req));
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 64) || null;
  // simple anti-spam: 5 messages per hour per IP
  if (ip) {
    const n = (await query("select count(*)::int as n from contact_messages where ip = $1 and created_at > now() - interval '1 hour'", [ip])).rows[0].n;
    if (n >= 5) throw new HttpError(429, "Too many messages. Please try again later.");
  }
  await query("insert into contact_messages (name, email, message, ip) values ($1, $2, $3, $4)", [d.name, d.email, d.message, ip]);
  return json({ ok: true }, 201);
}, { auth: false });
