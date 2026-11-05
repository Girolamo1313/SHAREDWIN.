"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

export default function AdminPanel({ open }) {
  const router = useRouter();
  const [f, setF] = useState({ sport: "Football", league: "", home: "", away: "", kickoff: "", maxPlayers: 100 });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function create(e) {
    e.preventDefault();
    setMsg(null);
    if (!f.kickoff) return setMsg({ err: true, text: "Pick a kickoff date." });
    const r = await post("/api/admin/matches", {
      sport: f.sport, league: f.league, home: f.home, away: f.away,
      kickoffAt: new Date(f.kickoff).toISOString(), maxPlayers: Number(f.maxPlayers),
    });
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    setMsg({ err: false, text: "Match created." });
    router.refresh();
  }
  async function settle(id, result) {
    if (!confirm(`Settle match #${id} with result ${result}? This pays out winners and cannot be undone.`)) return;
    const r = await post(`/api/admin/matches/${id}/settle`, { result });
    setMsg(r.ok ? { err: false, text: `Settled. Pot ${r.data.summary.pool / 100}, fee ${r.data.summary.fee / 100}.` } : { err: true, text: r.data.error || "Failed." });
    router.refresh();
  }

  return (
    <>
      <form className="panel" onSubmit={create}>
        <h3>Create a match</h3>
        <div className="grid g2">
          <div><label>Sport</label><input type="text" value={f.sport} onChange={set("sport")} required /></div>
          <div><label>League</label><input type="text" value={f.league} onChange={set("league")} required /></div>
          <div><label>Home</label><input type="text" value={f.home} onChange={set("home")} required /></div>
          <div><label>Away</label><input type="text" value={f.away} onChange={set("away")} required /></div>
          <div><label>Kickoff</label><input type="datetime-local" value={f.kickoff} onChange={set("kickoff")} required /></div>
          <div><label>Max players</label><input type="number" min="2" max="1000" value={f.maxPlayers} onChange={set("maxPlayers")} /></div>
        </div>
        <button className="btn pink block mt">Create match</button>
      </form>
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <h2>Open matches</h2>
      {open.length === 0 && <p className="muted">No open matches.</p>}
      {open.map((m) => (
        <div className="panel" key={m.id}>
          <div className="row between">
            <b>#{m.id} {m.home} vs {m.away}</b>
            <span className="small muted">{m.players} players · pot {m.pool_live / 100}</span>
          </div>
          <div className="row mt">
            <button className="btn" onClick={() => settle(m.id, "H")}>1 · {m.home}</button>
            <button className="btn" onClick={() => settle(m.id, "D")}>X · Draw</button>
            <button className="btn" onClick={() => settle(m.id, "A")}>2 · {m.away}</button>
          </div>
        </div>
      ))}
    </>
  );
}
