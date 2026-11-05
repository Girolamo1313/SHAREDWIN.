import Link from "next/link";
import LoginRequired from "@/components/LoginRequired";
import { getUser } from "@/lib/auth";
import { listUserBets } from "@/lib/queries";
import { fmtCoins, pickLabel, pickSymbol } from "@/lib/rules";

export const dynamic = "force-dynamic";
export const metadata = { title: "History – SharedWin" };

export default async function History() {
  const user = await getUser();
  if (!user) return <LoginRequired />;
  const bets = await listUserBets(user.id);
  return (
    <>
      <h2>Bet history</h2>
      {bets.length === 0 && <div className="panel empty"><p>Nothing here yet.</p><Link className="btn" href="/matches">Play</Link></div>}
      {bets.map((b) => {
        const tag = b.status === "won" ? <span className="tag g">Won +{fmtCoins(b.payout_cents)}</span> : b.status === "lost" ? <span className="tag r">Lost</span> : b.status === "refunded" ? <span className="tag">Refunded</span> : <span className="tag m">Pending</span>;
        return (
          <Link key={b.id} className="lrow" href={`/matches/${b.match_id}`}>
            <div className="nm">{b.home} vs {b.away}<br />
              <span className="small muted">{pickSymbol(b.pick)} · {pickLabel(b, b.pick)} · stake {fmtCoins(b.stake_cents)} · {new Date(b.created_at).toLocaleDateString("en-GB")}</span></div>
            <div className="am">{tag}</div>
          </Link>
        );
      })}
    </>
  );
}
