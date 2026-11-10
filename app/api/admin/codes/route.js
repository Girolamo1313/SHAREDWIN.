import { z } from "zod";
import { query } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { generateCode } from "@/lib/codes";

const schema = z.object({
  count: z.number().int().min(1).max(50),
  amountCoins: z.number().int().min(1).max(1000),
});

export const POST = handler(async (req) => {
  const { count, amountCoins } = schema.parse(await readJson(req));
  const codes = [];
  for (let tries = 0; codes.length < count && tries < count * 5; tries++) {
    const code = generateCode();
    const r = await query(
      "insert into pognon_codes (code, amount_cents) values ($1, $2) on conflict do nothing returning code",
      [code, amountCoins * 100]
    );
    if (r.rows[0]) codes.push(code);
  }
  return json({ ok: true, codes, amountCoins }, 201);
}, { admin: true });
