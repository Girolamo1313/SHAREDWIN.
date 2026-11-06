import { getUser } from "@/lib/auth";
import { leaderboard } from "@/lib/queries";
import { Trophy } from "@/components/Sprite";
import { fmtCoins } from "@/lib/rules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard – SharedWin" };

export default async function Leaderboard() {
  const [user, rows] = await Promise.all([getUser(), leaderboard()]);
  return (
    <>
      <h2>Leaderboard</h2>
      <section className="panel" style={{ textAlign: "center" }}>
        <div className="row" style={{ justifyContent: "center" }}><Trophy px={6} /></div>
        <p className="muted" style={{ margin: "10px 0 0" }}>Ranked by net winnings</p>
      </section>
      {rows.map((r, i) => (
        <div key={r.id} className={`lrow${user?.id === r.id ? " me" : ""}`}>
          <div className="rk">#{i + 1}</div>
          <div className="nm">{r.username}{user?.id === r.id ? " (you)" : ""}<br /><span className="small" style={{ opacity: 0.7 }}>{r.wins} wins · {r.played} settled bets</span></div>
          <div className="am">{r.net >= 0 ? "+" : ""}{fmtCoins(r.net)}</div>
        </div>
      ))}
      {rows.length === 0 && <p className="muted">No players yet.</p>}
    </>
  );
}
