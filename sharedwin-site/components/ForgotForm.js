"use client";
import { useState } from "react";
import { post } from "@/lib/client";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await post("/api/auth/forgot", { email });
    setBusy(false);
    setMsg(r.ok
      ? { err: false, text: "If an account uses this e-mail, a reset link is on its way. Check your inbox (and spam)." }
      : { err: true, text: r.data.error || "Something went wrong." });
  }
  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h3>Forgot your password?</h3>
      <p className="small muted mt">Enter the e-mail of your account. We send you a link to choose a new password.</p>
      <label htmlFor="fe">Email</label>
      <input id="fe" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <button className="btn pink block mt" disabled={busy}>{busy ? "..." : "Send the link"}</button>
    </form>
  );
}
