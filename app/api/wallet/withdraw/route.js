import { z } from "zod";
import { tx } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { provider } from "@/lib/payments";

const schema = z.object({ amountCoins: z.number().int().min(10, "Minimum withdrawal is 10").max(100000) });

export const POST = handler(async (req, _ctx, user) => {
  const { amountCoins } = schema.parse(await readJson(req));
  const cents = amountCoins * 100;
  await provider.withdraw({ userId: user.id, amountCents: cents });
  const balance = await tx((c) => credit(c, user.id, -cents, "withdraw", "Simulated withdrawal"));
  return json({ ok: true, balanceCents: balance });
});
