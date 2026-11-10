"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";
import Avatar from "./Avatar";
import { KINDS, PALETTE, VARIANT_COUNT, cleanAvatar } from "@/lib/avatar";

export default function AvatarEditor({ initial }) {
  const router = useRouter();
  const [a, setA] = useState(cleanAvatar(initial));
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (patch) => setA((cur) => ({ ...cur, ...patch }));

  async function save() {
    setMsg(null); setBusy(true);
    const r = await post("/api/me/avatar", a);
    setBusy(false);
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Could not save." });
    setMsg({ err: false, text: "Avatar saved." });
    router.refresh();
  }

  const swatches = (key) => (
    <div className="chips" role="group" aria-label={key === "c1" ? "Main color" : "Second color"}>
      {PALETTE.map((c) => (
        <button key={c} type="button" onClick={() => set({ [key]: c })} aria-label={c} aria-pressed={a[key] === c}
          style={{ width: 34, height: 34, borderRadius: 8, background: c, border: a[key] === c ? "3px solid #fff" : "2px solid #00f0ff", cursor: "pointer", boxShadow: a[key] === c ? "0 0 12px #fff" : "none" }} />
      ))}
    </div>
  );

  return (
    <section className="panel">
      <h3>Your avatar</h3>
      <div className="row mt" style={{ alignItems: "flex-start" }}>
        <Avatar avatar={a} size={120} label="Avatar preview" />
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <label>Type</label>
          <div className="chips">
            {KINDS.map(([k, name]) => <button key={k} type="button" className={`chip${a.kind === k ? " on" : ""}`} onClick={() => set({ kind: k, variant: 0 })}>{name}</button>)}
          </div>
        </div>
      </div>
      <label>Style</label>
      <div className="chips">
        {Array.from({ length: VARIANT_COUNT }, (_, i) => (
          <button key={i} type="button" onClick={() => set({ variant: i })} aria-label={`Style ${i + 1}`} aria-pressed={a.variant === i}
            style={{ background: "none", border: 0, padding: 2, borderRadius: 16, cursor: "pointer", outline: a.variant === i ? "3px solid #ff2a9d" : "none" }}>
            <Avatar avatar={{ ...a, variant: i }} size={52} />
          </button>
        ))}
      </div>
      <label>{a.kind === "animal" ? "Fur color" : "Main color"}</label>
      {swatches("c1")}
      <label>{a.kind === "animal" ? "Accent color" : "Second color"}</label>
      {swatches("c2")}
      {a.kind === "jersey" && (
        <>
          <label htmlFor="jnum">Shirt number (0 to 99)</label>
          <input id="jnum" type="number" min="0" max="99" value={a.num} onChange={(e) => set({ num: Math.max(0, Math.min(99, Math.floor(Number(e.target.value) || 0))) })} />
        </>
      )}
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <button type="button" className="btn pink block mt" onClick={save} disabled={busy}>{busy ? "..." : "Save avatar"}</button>
    </section>
  );
}
