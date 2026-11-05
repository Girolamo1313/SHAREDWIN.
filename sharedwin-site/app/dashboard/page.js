import Link from "next/link";
import LoginRequired from "@/components/LoginRequired";
import { getUser } from "@/lib/auth";
import { listUserBets, userStats } from "@/lib/queries";
import { fmtCoins, pickLabel, pickSymbol, DEFAULT_COMMISSION_BPS } from "@/lib/rules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard – SharedWin" };

export default async function Dashboard() {
  const user = await getUser();
  if (!user) return <LoginRequired />;
  const [s, bets] = await Promise.all([userStats(user.id), listUserBets(user.id)]);
  const active = bets.filter((b) => b.status === "pending");
  const rate = s.won + s.lost ? Math.round((s.won / (s.won + s.lost)) * 100) : 0;
  return (
    <>
      <h2>Dashboard</h2>
      <p className="muted">Hello {user.username}.</p>
      <div className="grid g3" style={{ margin: "16px 0 26px" }}>
        <div className="stat"><span className="small muted">Balance</span><div className="v">{fmtCoins(user.balance_cents)} coins</div></div>
        <div className="stat"><span className="small muted">Active bets</span><div className="v">{s.pending}</div></div>
        <div className="stat"><span className="small muted">Net result</span><div className={`v ${s.net >= 0 ? "pos" : "neg"}`}>{s.net >= 0 ? "+" : ""}{fmtCoins(s.net)}</div></div>
        <div className="stat"><span className="small muted">Total staked</span><div className="v">{fmtCoins(s.staked)}</div></div>
        <div className="stat"><span className="small muted">Wins / losses</span><div className="v">{s.won} / {s.lost}</div></div>
        <div className="stat"><span className="small muted">Win rate</span><div className="v">{rate}%</div></div>
      </div>

      <h2>Active tickets</h2>
      {active.length === 0 && <div className="panel empty"><p>No active bets yet.</p><Link className="btn" href="/matches">Find a match</Link></div>}
      {active.map((b) => (
        <Link key={b.id} className="lrow" href={`/matches/${b.match_id}`}>
          <div className="nm">{b.home} vs {b.away}<br /><span className="small muted">{pickSymbol(b.pick)} · {pickLabel(b, b.pick)}</span></div>
          <div className="am">-{fmtCoins(b.stake_cents)}</div>
        </Link>
      ))}

      <h2 style={{ marginTop: 26 }}>How the pot works</h2>
      <section className="panel">
        <div className="calc">
          <div><span>1. Pot</span><b>Σ all stakes</b></div>
          <div><span>2. Fixed fee</span><b>{DEFAULT_COMMISSION_BPS / 100}% of pot</b></div>
          <div><span>3. Net pot</span><b>pot × {(1 - DEFAULT_COMMISSION_BPS / 10000).toFixed(2)}</b></div>
          <div><span>4. Your share</span><b>stake ÷ Σ winning stakes</b></div>
          <div><span>5. Your payout</span><b>share × net pot</b></div>
        </div>
        <p className="muted mt">Example: 100 players stake 2,000 in total → fee 100 → net pot 1,900. If winners staked 800 in total, a 40-coin winner gets 40 ÷ 800 × 1,900 = <b>95</b>. No winners? Everyone is refunded.</p>
      </section>
    </>
  );
}
