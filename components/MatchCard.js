import Link from "next/link";
import { fmtCoins } from "@/lib/rules";

export default function MatchCard({ m }) {
  const pct = Math.round((m.players / m.max_players) * 100);
  const full = m.players >= m.max_players;
  const tag = m.status === "finished" ? <span className="tag m">Finished</span> : full ? <span className="tag r">Full</span> : <span className="tag g">Open</span>;
  const when = new Date(m.kickoff_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <Link className="mcard" href={`/matches/${m.id}`}>
      <div className="row between"><span className="tag">{m.sport}</span>{tag}</div>
      <p className="small muted" style={{ margin: "10px 0 0" }}>{m.league} · {when}</p>
      {m.title && <p style={{ margin: "10px 0 0", fontWeight: 700 }}>{m.title}</p>}
      <div className="vs"><div className="team">{m.home}</div><div className="vsb">VS</div><div className="team">{m.away}</div></div>
      <div className="row between small"><span>Pot <b>{fmtCoins(m.pool_live)}</b> coins</span><span>{m.players}/{m.max_players} players</span></div>
      <div className="meter" style={{ marginTop: 8 }}><i style={{ width: `${pct}%` }} /></div>
    </Link>
  );
}
