import { z } from "zod";
import { tx } from "@/lib/db";
import { handler, readJson, json, HttpError } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { computeSettlement } from "@/lib/rules";

const schema = z.object({ result: z.enum(["H", "D", "A"]) });

export const POST = handler(async (req, { params }) => {
  if (!/^\d+$/.test(params.id)) throw new HttpError(404, "Match not found.");
  const { result } = schema.parse(await readJson(req));

  const summary = await tx(async (c) => {
    const m = (await c.query("select * from matches where id = $1 for update", [params.id])).rows[0];
    if (!m) throw new HttpError(404, "Match not found.");
    if (m.status !== "open") throw new HttpError(409, "Match already settled.");

    const bets = (await c.query("select id, user_id, pick, stake_cents from bets where match_id = $1 for update", [m.id])).rows;
    const s = computeSettlement(bets, result, m.commission_bps);

    for (const p of s.payouts) {
      await c.query("update bets set status = $2, payout_cents = $3 where id = $1", [p.id, p.status, p.payout]);
      if (p.payout > 0) await credit(c, p.user_id, p.payout, p.status === "refunded" ? "refund" : "payout", `${m.home} vs ${m.away}`);
    }
    await c.query(
      `update matches set status = 'finished', result = $2, pool_cents = $3, fee_cents = $4, net_cents = $5,
         win_stake_cents = $6, refunded = $7, settled_at = now() where id = $1`,
      [m.id, result, s.pool, s.fee, s.net, s.winStake, s.refunded]
    );
    return { pool: s.pool, fee: s.fee, net: s.net, winStake: s.winStake, refunded: s.refunded, bets: bets.length };
  });
  return json({ ok: true, summary });
}, { admin: true });
