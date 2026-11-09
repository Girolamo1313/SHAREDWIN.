"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

const EMPTY = { sport: "Football", league: "", title: "", home: "", away: "", hasDraw: true, drawLabel: "", kickoff: "", maxPlayers: 100 };

export default function AdminPanel({ open, messages = [] }) {
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function create(e) {
    e.preventDefault();
    setMsg(null);
    if (!f.kickoff) return setMsg({ err: true, text: "Pick a closing date." });
    const r = await post("/api/admin/matches", {
      sport: f.sport, league: f.league, home: f.home, away: f.away,
      title: f.title || undefined, hasDraw: f.hasDraw, drawLabel: f.drawLabel || undefined,
      kickoffAt: new Date(f.kickoff).toISOString(), maxPlayers: Number(f.maxPlayers),
    });
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    setMsg({ err: false, text: "Market created." });
    setF(EMPTY);
    router.refresh();
  }
  async function settle(id, result) {
    if (!confirm(`Settle market #${id} with result ${result}? This pays out winners and cannot be undone.`)) return;
    const r = await post(`/api/admin/matches/${id}/settle`, { result });
    setMsg(r.ok ? { err: false, text: `Settled. Pot ${r.data.summary.pool / 100}, fee ${r.data.summary.fee / 100}.` } : { err: true, text: r.data.error || "Failed." });
    router.refresh();
  }

  return (
    <>
      <form className="panel" onSubmit={create}>
        <h3>Create a market</h3>
        <p className="small muted mt">A match (1 · X · 2), a duel (2 options) or any question with 2 or 3 answers. Option 1 and option 2 are the labels players see.</p>
        <label>Question / title (optional)</label>
        <input type="text" value={f.title} onChange={set("title")} placeholder="Who wins the Ballon d'Or?" maxLength={120} />
        <div className="grid g2">
          <div><label>Category</label><input type="text" value={f.sport} onChange={set("sport")} required /></div>
          <div><label>Competition / topic</label><input type="text" value={f.league} onChange={set("league")} required /></div>
          <div><label>Option 1</label><input type="text" value={f.home} onChange={set("home")} required /></div>
          <div><label>Option 2</label><input type="text" value={f.away} onChange={set("away")} required /></div>
          <div><label>Closes at</label><input type="datetime-local" value={f.kickoff} onChange={set("kickoff")} required /></div>
          <div><label>Max players</label><input type="number" min="2" max="1000" value={f.maxPlayers} onChange={set("maxPlayers")} /></div>
        </div>
        <label className="check"><input type="checkbox" checked={f.hasDraw} onChange={(e) => setF({ ...f, hasDraw: e.target.checked })} /> Add a third option X (draw / other)</label>
        {f.hasDraw && (<><label>Label for X (default: Draw)</label><input type="text" value={f.drawLabel} onChange={set("drawLabel")} placeholder="Draw" maxLength={40} /></>)}
        <button className="btn pink block mt">Create market</button>
      </form>
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <h2>Open markets</h2>
      {open.length === 0 && <p className="muted">No open markets.</p>}
      {open.map((m) => (
        <div className="panel" key={m.id}>
          <div className="row between">
            <b>#{m.id} {m.title ? `${m.title} · ` : ""}{m.home} vs {m.away}</b>
            <span className="small muted">{m.players} players · pot {m.pool_live / 100}</span>
          </div>
          <div className="row mt">
            <button className="btn" onClick={() => settle(m.id, "H")}>1 · {m.home}</button>
            {m.has_draw !== false && <button className="btn" onClick={() => settle(m.id, "D")}>X · {m.draw_label || "Draw"}</button>}
            <button className="btn" onClick={() => settle(m.id, "A")}>2 · {m.away}</button>
          </div>
        </div>
      ))}
      <h2>Contact messages</h2>
      {messages.length === 0 && <p className="muted">No messages yet.</p>}
      {messages.map((x) => (
        <div className="panel" key={x.id}>
          <div className="row between"><b>{x.name}</b><span className="small muted">{new Date(x.created_at).toLocaleString("en-GB")}</span></div>
          <p className="small muted" style={{ margin: "4px 0 8px" }}>{x.email}</p>
          <p style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{x.message}</p>
        </div>
      ))}
    </>
  );
}
