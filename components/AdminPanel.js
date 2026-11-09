"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

const EMPTY = { sport: "Football", league: "", title: "", home: "", away: "", hasDraw: true, drawLabel: "", kickoff: "", maxPlayers: 100 };

export default function AdminPanel({ open, messages = [], codes = [] }) {
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const [cg, setCg] = useState({ count: 1, amount: 100 });
  const [fresh, setFresh] = useState([]);
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
  async function makeCodes(e) {
    e.preventDefault();
    setMsg(null);
    const r = await post("/api/admin/codes", { count: Number(cg.count), amountCoins: Number(cg.amount) });
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    setFresh(r.data.codes);
    setMsg({ err: false, text: `${r.data.codes.length} code(s) created, ${r.data.amountCoins} pognons each.` });
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
      <form className="panel" onSubmit={makeCodes}>
        <h3>Pognon codes</h3>
        <p className="small muted mt">One code = one deposit, usable once. Send each player their own code.</p>
        <div className="grid g2">
          <div><label>How many codes</label><input type="number" min="1" max="50" value={cg.count} onChange={(e) => setCg({ ...cg, count: e.target.value })} /></div>
          <div><label>Pognons per code</label><input type="number" min="1" max="1000" value={cg.amount} onChange={(e) => setCg({ ...cg, amount: e.target.value })} /></div>
        </div>
        <button className="btn pink block mt">Generate codes</button>
        {fresh.length > 0 && (
          <div className="calc" style={{ marginTop: 14 }}>
            {fresh.map((c) => <div key={c}><b style={{ fontFamily: "var(--px)", letterSpacing: ".08em" }}>{c}</b></div>)}
          </div>
        )}
      </form>
      {codes.length > 0 && (
        <>
          <h3 style={{ margin: "6px 0 10px" }}>Latest codes</h3>
          {codes.map((c) => (
            <div className="lrow" key={c.code}>
              <div className="nm"><span style={{ fontFamily: "var(--px)", letterSpacing: ".06em" }}>{c.code}</span><br /><span className="small muted">{c.amount_cents / 100} pognons · {c.used_by_name ? `used by ${c.used_by_name}` : "not used yet"}</span></div>
              <div className={`am ${c.used_by_name ? "neg" : "pos"}`}>{c.used_by_name ? "USED" : "FREE"}</div>
            </div>
          ))}
        </>
      )}
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
