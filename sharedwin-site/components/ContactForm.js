"use client";
import { useState } from "react";
import { post } from "@/lib/client";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await post("/api/contact", f);
    setBusy(false);
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Could not send." });
    setF({ name: "", email: "", message: "" });
    setMsg({ err: false, text: "Message sent. Thank you!" });
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="grid g2">
        <div><label htmlFor="c-name">Name</label><input id="c-name" type="text" value={f.name} onChange={set("name")} required maxLength={60} autoComplete="name" /></div>
        <div><label htmlFor="c-mail">E-mail</label><input id="c-mail" type="email" value={f.email} onChange={set("email")} required maxLength={120} autoComplete="email" /></div>
      </div>
      <label htmlFor="c-msg">Message</label>
      <textarea id="c-msg" value={f.message} onChange={set("message")} required minLength={5} maxLength={1500} rows={5} />
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <button className="btn pink mt" disabled={busy}>{busy ? "..." : "Send message"}</button>
    </form>
  );
}
