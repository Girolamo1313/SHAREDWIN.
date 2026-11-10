import { query } from "@/lib/db";

const MATCH_SELECT = `
  select m.*,
    count(b.id)::int as players,
    coalesce(sum(b.stake_cents), 0)::int as pool_live,
    coalesce(sum(b.stake_cents) filter (where b.pick = 'H'), 0)::int as h_stake,
    coalesce(sum(b.stake_cents) filter (where b.pick = 'D'), 0)::int as d_stake,
    coalesce(sum(b.stake_cents) filter (where b.pick = 'A'), 0)::int as a_stake,
    count(b.id) filter (where b.pick = 'H')::int as h_n,
    count(b.id) filter (where b.pick = 'D')::int as d_n,
    count(b.id) filter (where b.pick = 'A')::int as a_n
  from matches m left join bets b on b.match_id = m.id`;

export async function listMatches({ sport, status } = {}) {
  const where = [];
  const params = [];
  if (sport) { params.push(sport); where.push(`m.sport = $${params.length}`); }
  if (status) { params.push(status); where.push(`m.status = $${params.length}`); }
  const sql = `${MATCH_SELECT} ${where.length ? "where " + where.join(" and ") : ""}
    group by m.id order by (m.status = 'open') desc, m.kickoff_at asc`;
  return (await query(sql, params)).rows;
}

export async function getMatch(id) {
  if (!/^\d+$/.test(String(id))) return null;
  const r = await query(`${MATCH_SELECT} where m.id = $1 group by m.id`, [id]);
  return r.rows[0] ?? null;
}

export async function listSports() {
  const r = await query("select distinct sport from matches order by sport");
  return r.rows.map((x) => x.sport);
}

export async function getUserBet(userId, matchId) {
  const r = await query("select * from bets where user_id = $1 and match_id = $2", [userId, matchId]);
  return r.rows[0] ?? null;
}

export async function listUserBets(userId) {
  const r = await query(
    `select b.*, m.home, m.away, m.sport, m.league, m.status as match_status, m.result
     from bets b join matches m on m.id = b.match_id
     where b.user_id = $1 order by b.created_at desc`,
    [userId]
  );
  return r.rows;
}

export async function userStats(userId) {
  const r = await query(
    `select
       count(*) filter (where status = 'pending')::int as pending,
       count(*) filter (where status = 'won')::int as won,
       count(*) filter (where status = 'lost')::int as lost,
       coalesce(sum(stake_cents), 0)::int as staked,
       coalesce(sum(case status when 'won' then payout_cents - stake_cents when 'lost' then -stake_cents else 0 end), 0)::int as net
     from bets where user_id = $1`,
    [userId]
  );
  return r.rows[0];
}

export async function listTransactions(userId, limit = 30) {
  const r = await query(
    "select * from transactions where user_id = $1 order by created_at desc, id desc limit $2",
    [userId, limit]
  );
  return r.rows;
}

export async function leaderboard(limit = 20) {
  const r = await query(
    `select u.id, u.username, u.avatar,
       coalesce(sum(case b.status when 'won' then b.payout_cents - b.stake_cents when 'lost' then -b.stake_cents else 0 end), 0)::int as net,
       count(b.id) filter (where b.status = 'won')::int as wins,
       count(b.id) filter (where b.status in ('won','lost'))::int as played
     from users u left join bets b on b.user_id = u.id
     group by u.id order by net desc, wins desc, u.created_at asc limit $1`,
    [limit]
  );
  return r.rows;
}
