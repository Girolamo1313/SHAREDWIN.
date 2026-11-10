import { getUser } from "@/lib/auth";
import { leaderboard } from "@/lib/queries";
import { Trophy } from "@/components/Sprite";
import { fmtCoins } from "@/lib/rules";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard – Top SharedWin players", description: "See who is winning the most on SharedWin. Players are ranked by net winnings.", alternates: { canonical: "/leaderboard" } };

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
          <Avatar avatar={r.avatar} size={36} />
          <div className="nm" style={{ flex: 1 }}>{r.username}{user?.id === r.id ? " (you)" : ""}<br /><span className="small" style={{ opacity: 0.7 }}>{r.wins} wins · {r.played} settled bets</span></div>
          <div className="am">{r.net >= 0 ? "+" : ""}{fmtCoins(r.net)}</div>
        </div>
      ))}
      {rows.length === 0 && <p className="muted">No players yet.</p>}
    </>
  );
}
