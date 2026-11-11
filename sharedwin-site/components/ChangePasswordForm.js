"use client";
import { useState } from "react";
import { post } from "@/lib/client";

export default function ChangePasswordForm() {
  const [f, setF] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await post("/api/me/password", f);
    setBusy(false);
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Something went wrong." });
    setF({ current: "", next: "" });
    setMsg({ err: false, text: "Password changed." });
  }
  return (
    <form className="panel" onSubmit={submit}>
      <h3>Change your password</h3>
      <label htmlFor="cp">Current password</label>
      <input id="cp" type="password" autoComplete="current-password" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} required />
      <label htmlFor="cn">New password (8 characters minimum)</label>
      <input id="cn" type="password" autoComplete="new-password" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} minLength={8} maxLength={72} required />
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <button className="btn block mt" disabled={busy}>{busy ? "..." : "Change password"}</button>
    </form>
  );
}
