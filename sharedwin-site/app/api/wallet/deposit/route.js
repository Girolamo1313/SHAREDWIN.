import { z } from "zod";
import { tx } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { provider } from "@/lib/payments";

const schema = z.object({ amountCoins: z.number().int().min(1).max(1000, "Max 1000 per deposit") });

export const POST = handler(async (req, _ctx, user) => {
  const { amountCoins } = schema.parse(await readJson(req));
  const cents = amountCoins * 100;
  await provider.deposit({ userId: user.id, amountCents: cents });
  const balance = await tx((c) => credit(c, user.id, cents, "deposit", "Simulated deposit"));
  return json({ ok: true, balanceCents: balance });
});
