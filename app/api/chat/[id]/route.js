import { query } from "@/lib/db";
import { handler, json, HttpError } from "@/lib/api";

// Admins can remove a message.
export const DELETE = handler(async (_req, { params }) => {
  if (!/^\d+$/.test(params.id)) throw new HttpError(404, "Not found.");
  await query("delete from chat_messages where id = $1", [params.id]);
  return json({ ok: true });
}, { admin: true });
