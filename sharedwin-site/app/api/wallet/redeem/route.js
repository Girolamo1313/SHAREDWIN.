import { z } from "zod";
import { query, tx } from "@/lib/db";
import { handler, readJson, json, HttpError } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { normalizeCode } from "@/lib/codes";

const schema = z.object({ code: z.string().trim().min(3, "Enter your code.").max(30) });

export const POST = handler(async (req, _ctx, user) => {
  const { code: raw } = schema.parse(await readJson(req));

  // Anti brute-force: 5 wrong codes per 15 minutes per player.
  const failed = (await query(
    "select count(*)::int as n from code_attempts where user_id = $1 and created_at > now() - interval '15 minutes'", [user.id]
  )).rows[0].n;
  if (failed >= 5) throw new HttpError(429, "Too many wrong codes. Try again in 15 minutes.");

  const code = normalizeCode(raw);
  const result = code && await tx(async (c) => {
    // The "used_by is null" condition makes a code usable exactly once, even with simultaneous requests.
    const r = await c.query(
      "update pognon_codes set used_by = $1, used_at = now() where code = $2 and used_by is null returning amount_cents",
      [user.id, code]
    );
    if (!r.rows[0]) return null;
    const amount = r.rows[0].amount_cents;
    const balance = await credit(c, user.id, amount, "deposit", `Pognon code ${code}`);
    return { balance, amount };
  });

  if (!result) {
    await query("insert into code_attempts (user_id) values ($1)", [user.id]);
    throw new HttpError(400, "Invalid or already used code.");
  }
  return json({ ok: true, balanceCents: result.balance, amountCents: result.amount });
});
