import { z } from "zod";
import { query } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { DEFAULT_COMMISSION_BPS, DEFAULT_MAX_PLAYERS } from "@/lib/rules";

const schema = z.object({
  sport: z.string().trim().min(2).max(30),
  league: z.string().trim().min(2).max(60),
  home: z.string().trim().min(1).max(40),
  away: z.string().trim().min(1).max(40),
  kickoffAt: z.string().datetime({ offset: true }),
  title: z.string().trim().max(120).optional(),
  hasDraw: z.boolean().default(true),
  drawLabel: z.string().trim().max(40).optional(),
  maxPlayers: z.number().int().min(2).max(1000).default(DEFAULT_MAX_PLAYERS),
});

export const POST = handler(async (req) => {
  const d = schema.parse(await readJson(req));
  const r = await query(
    `insert into matches (sport, league, home, away, kickoff_at, max_players, commission_bps, title, has_draw, draw_label)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
    [d.sport, d.league, d.home, d.away, d.kickoffAt, d.maxPlayers, DEFAULT_COMMISSION_BPS,
     d.title || null, d.hasDraw, d.hasDraw ? (d.drawLabel || null) : null]
  );
  return json({ ok: true, id: r.rows[0].id }, 201);
}, { admin: true });
