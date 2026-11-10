import { z } from "zod";
import { query } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { PALETTE, VARIANT_COUNT } from "@/lib/avatar";

const schema = z.object({
  kind: z.enum(["hero", "jersey", "animal"]),
  variant: z.number().int().min(0).max(VARIANT_COUNT - 1),
  c1: z.enum(PALETTE),
  c2: z.enum(PALETTE),
  num: z.number().int().min(0).max(99),
});

export const POST = handler(async (req, _ctx, user) => {
  const a = schema.parse(await readJson(req));
  await query("update users set avatar = $2::jsonb where id = $1", [user.id, JSON.stringify(a)]);
  return json({ ok: true });
});
