import Link from "next/link";
import { notFound } from "next/navigation";
import BetForm from "@/components/BetForm";
import { getUser } from "@/lib/auth";
import { getMatch, getUserBet } from "@/lib/queries";
import { fmtCoins, pickLabel, pickSymbol } from "@/lib/rules";

export const dynamic = "force-dynamic";

function ReadonlyPicks({ m, mine }) {
  const totals = { H: m.h_stake, D: m.d_stake, A: m.a_stake };
  const counts = { H: m.h_n, D: m.d_n, A: m.a_n };
  const pool = totals.H + totals.D + totals.A;
  return (
    <div className="picks" style={{ marginBottom: 26 }}>
      {["H", "D", "A"].map((p) => {
        const share = pool ? Math.round((totals[p] / pool) * 100) : 0;
        const on = m.result === p || (!m.result && mine?.pick === p);
        return (
          <div key={p} className={`pick${on ? " on" : ""}`}>
            <span className="n">{pickSymbol(p)}</span>
            <span className="t">{pickLabel(m, p)}</span>
            {counts[p]} bets
            <div className="share"><i style={{ width: `${share}%` }} /></div>
            {share}% of pot
            {m.result === p && <><br /><b>Winner</b></>}
          </div>
        );
      })}
    </div>
  );
}

export default async function MatchPage({ params }) {
  const m = await getMatch(params.id);
  if (!m) notFound();
  const user = await getUser();
  const mine = user ? await getUserBet(user.id, m.id) : null;
  const full = m.players >= m.max_players;
  const started = new Date(m.kickoff_at) <= new Date();
  const when = new Date(m.kickoff_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const feePct = m.commission_bps / 100;

  return (
    <>
      <Link className="tag m" href="/matches">← Back</Link><br /><br />
      <section className="panel">
        <div className="row between"><span className="tag">{m.sport}</span><span className="small muted">{m.league} · {when}</span></div>
        <div className="vs" style={{ margin: "22px 0" }}><div className="team">{m.home}</div><div className="vsb">VS</div><div className="team">{m.away}</div></div>
        <div className="calc">
          <div><span>Pot</span><b>{fmtCoins(m.pool_live)} coins</b></div>
          <div><span>Players</span><b>{m.players} / {m.max_players}</b></div>
          <div><span>Fixed fee</span><b>{feePct}%</b></div>
        </div>
      </section>

      {m.status === "finished" ? (
        <>
          <h2>Result</h2>
          <ReadonlyPicks m={m} mine={mine} />
          <section className="panel">
            <h3>How the payout was computed</h3>
            <div className="calc mt">
              <div><span>Pot (sum of stakes)</span><b>{fmtCoins(m.pool_cents)}</b></div>
              <div><span>− Fixed fee {feePct}%</span><b>{fmtCoins(m.fee_cents)}</b></div>
              <div><span>= Net pot</span><b>{fmtCoins(m.net_cents)}</b></div>
              <div><span>Winning stakes ({pickSymbol(m.result)})</span><b>{fmtCoins(m.win_stake_cents)}</b></div>
              <div><span>Payout per 1 coin staked</span><b>{m.win_stake_cents ? (m.net_cents / m.win_stake_cents).toFixed(3) : "–"}</b></div>
            </div>
            {m.refunded && <p className="mt">Nobody picked the winning outcome: all stakes were refunded, no fee taken.</p>}
          </section>
          {mine && (
            <section className="panel">
              <h3>Your ticket</h3>
              <p className="mt">{pickSymbol(mine.pick)} · {pickLabel(m, mine.pick)} · stake {fmtCoins(mine.stake_cents)} → <b className={mine.status === "won" ? "pos" : mine.status === "lost" ? "neg" : ""}>{mine.status}</b> ({fmtCoins(mine.payout_cents)} coins)</p>
            </section>
          )}
        </>
      ) : mine ? (
        <>
          <h2>Your ticket</h2>
          <ReadonlyPicks m={m} mine={mine} />
          <section className="panel">
            <p>{pickSymbol(mine.pick)} · {pickLabel(m, mine.pick)} · stake <b>{fmtCoins(mine.stake_cents)}</b> coins</p>
            <p className="muted">Waiting for the final result. Payouts are credited automatically.</p>
          </section>
        </>
      ) : full || started ? (
        <>
          <h2>Closed</h2>
          <ReadonlyPicks m={m} mine={null} />
          <section className="panel"><p>{full ? `All ${m.max_players} seats are taken.` : "Kickoff has passed: betting is closed."}</p></section>
        </>
      ) : !user ? (
        <>
          <h2>Choose your outcome</h2>
          <ReadonlyPicks m={m} mine={null} />
          <section className="panel"><h3>Log in to play</h3><br /><Link className="btn pink blink" href="/auth">Insert coin</Link></section>
        </>
      ) : (
        <BetForm
          match={{ id: m.id, home: m.home, away: m.away, commission_bps: m.commission_bps }}
          totals={{ H: m.h_stake, D: m.d_stake, A: m.a_stake }}
          counts={{ H: m.h_n, D: m.d_n, A: m.a_n }}
          balanceCents={user.balance_cents}
        />
      )}
    </>
  );
}
