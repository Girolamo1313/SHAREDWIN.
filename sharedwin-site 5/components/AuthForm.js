"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ login: "", username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    const body = mode === "login"
      ? { login: f.login, password: f.password }
      : { username: f.username, email: f.email, password: f.password };
    const r = await post(mode === "login" ? "/api/auth/login" : "/api/auth/register", body);
    setBusy(false);
    if (!r.ok) return setErr(r.data.error || "Something went wrong.");
    router.push("/matches");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="tabs">
        <button type="button" className={`chip${mode === "login" ? " on" : ""}`} onClick={() => setMode("login")}>Log in</button>
        <button type="button" className={`chip${mode === "register" ? " on" : ""}`} onClick={() => setMode("register")}>Sign up</button>
      </div>
      {mode === "login" ? (
        <>
          <label htmlFor="login">Name or email</label>
          <input id="login" type="text" autoComplete="username" value={f.login} onChange={set("login")} required />
        </>
      ) : (
        <>
          <label htmlFor="username">Player name</label>
          <input id="username" type="text" maxLength={16} autoComplete="username" value={f.username} onChange={set("username")} required />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} required />
        </>
      )}
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={f.password} onChange={set("password")} required />
      {err && <div className="notice err" role="alert">{err}</div>}
      <button className="btn pink block mt" disabled={busy}>{busy ? "..." : mode === "login" ? "Log in" : "Create account"}</button>
      {mode === "register" && <p className="small muted mt">Welcome bonus: 500 coins. Demo money only, no real payments.</p>}
    </form>
  );
}
