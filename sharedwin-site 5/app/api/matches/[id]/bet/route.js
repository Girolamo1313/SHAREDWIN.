import { z } from "zod";
import { tx } from "@/lib/db";
import { handler, readJson, json, HttpError } from "@/lib/api";
import { credit } from "@/lib/wallet";
import { STAKE_MIN_CENTS, STAKE_MAX_CENTS } from "@/lib/rules";

const schema = z.object({
  pick: z.enum(["H", "D", "A"]),
  stakeCoins: z.number().int("Whole coins only").min(STAKE_MIN_CENTS / 100, `Minimum stake is ${STAKE_MIN_CENTS / 100} coins`)
    .max(STAKE_MAX_CENTS / 100, `Maximum stake is ${STAKE_MAX_CENTS / 100} coins`),
});

export const POST = handler(async (req, { params }, user) => {
  if (!/^\d+$/.test(params.id)) throw new HttpError(404, "Match not found.");
  const { pick, stakeCoins } = schema.parse(await readJson(req));
  const stake = stakeCoins * 100;

  const balance = await tx(async (c) => {
    // Lock the match row: bets on one match are processed one at a time,
    // so the player cap and the one-bet rule can never be raced.
    const m = (await c.query("select * from matches where id = $1 for update", [params.id])).rows[0];
    if (!m) throw new HttpError(404, "Match not found.");
    if (m.status !== "open" || new Date(m.kickoff_at) <= new Date()) throw new HttpError(409, "Betting is closed for this match.");

    const { n } = (await c.query("select count(*)::int as n from bets where match_id = $1", [m.id])).rows[0];
    if (n >= m.max_players) throw new HttpError(409, `Match is full (${m.max_players} players).`);

    try {
      await c.query("insert into bets (user_id, match_id, pick, stake_cents) values ($1, $2, $3, $4)", [user.id, m.id, pick, stake]);
    } catch (e) {
      if (e?.code === "23505") throw new HttpError(409, "You already have a bet on this match.");
      throw e;
    }
    return credit(c, user.id, -stake, "stake", `${m.home} vs ${m.away}`);
  });
  return json({ ok: true, balanceCents: balance });
});
