"use client";
import { useState } from "react";
import Link from "next/link";
import { post } from "@/lib/client";

export default function ResetForm({ token }) {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await post("/api/auth/reset", { token, password: pw });
    setBusy(false);
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Something went wrong." });
    setDone(true);
  }
  if (done) return (
    <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h3>Password changed</h3>
      <p className="mt">You can now log in with your new password.</p>
      <Link className="btn pink block mt" href="/auth">Log in</Link>
    </div>
  );
  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h3>Choose a new password</h3>
      <label htmlFor="np">New password (8 characters minimum)</label>
      <input id="np" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} maxLength={72} required />
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="alert">{msg.text}</div>}
      <button className="btn pink block mt" disabled={busy}>{busy ? "..." : "Save my new password"}</button>
    </form>
  );
}
