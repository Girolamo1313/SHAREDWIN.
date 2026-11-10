"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { post } from "@/lib/client";
import Avatar from "./Avatar";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ me: null, messages: [] });
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const list = useRef(null);
  const stick = useRef(true);

  async function load() {
    try {
      const r = await fetch("/api/chat", { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch {}
  }
  useEffect(() => {
    if (!open) return;
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [open]);
  useEffect(() => {
    if (list.current && stick.current) list.current.scrollTop = list.current.scrollHeight;
  }, [data, open]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setErr("");
    const r = await post("/api/chat", { body: text });
    if (!r.ok) return setErr(r.data.error || "Could not send.");
    setText("");
    stick.current = true;
    load();
  }
  async function remove(id) {
    await fetch(`/api/chat/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="chat">
      {open && (
        <div className="chat-win" role="dialog" aria-label="Chat">
          <div className="chat-head"><b>Community chat</b><button type="button" className="chat-x" onClick={() => setOpen(false)} aria-label="Close chat">×</button></div>
          <div className="chat-list" ref={list} onScroll={(e) => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40; }}>
            {data.messages.length === 0 && <p className="small muted">No messages yet. Say hello!</p>}
            {data.messages.map((m) => (
              <div key={m.id} className={`chat-msg${m.mine ? " mine" : ""}`}>
                <Avatar avatar={m.avatar} size={22} /> <span className="chat-who">{m.username}</span> {m.body}
                {data.me?.isAdmin && <button type="button" className="chat-del" onClick={() => remove(m.id)} aria-label="Delete message">✕</button>}
              </div>
            ))}
          </div>
          {data.me ? (
            <form className="chat-form" onSubmit={send}>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="Type a message" aria-label="Message" />
              <button className="btn pink" type="submit">Send</button>
            </form>
          ) : (
            <p className="small chat-login"><Link href="/auth">Log in</Link> to chat.</p>
          )}
          {err && <p className="small chat-err">{err}</p>}
          <p className="chat-note">Be kind. No spam. Messages may be removed.</p>
        </div>
      )}
      <button type="button" className="chat-fab btn pink" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? "Close" : "Chat"}</button>
    </div>
  );
}
