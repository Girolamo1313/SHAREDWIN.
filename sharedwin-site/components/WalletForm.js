"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";
import PognonMark from "./PognonMark";

export default function WalletForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [wd, setWd] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function redeem(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await post("/api/wallet/redeem", { code });
    setBusy(false);
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    setCode("");
    setMsg({ err: false, text: `Pognon received: +${r.data.amountCents / 100} added to your balance.` });
    router.refresh();
  }
  async function withdraw() {
    setMsg(null);
    const r = await post("/api/wallet/withdraw", { amountCoins: Math.floor(Number(wd)) });
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    setWd("");
    setMsg({ err: false, text: "Withdrawal requested (demo)." });
    router.refresh();
  }

  return (
    <>
      <div className="grid g2">
        <form className="panel" style={{ margin: 0 }} onSubmit={redeem}>
          <h3><PognonMark />Deposit with a code</h3>
          <p className="small muted mt">Enter the Pognon code you received. Each code works once.</p>
          <label htmlFor="code">Your code</label>
          <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="PGN-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={30} style={{ textTransform: "uppercase" }} />
          <button className="btn pink block mt" disabled={!code.trim() || busy}>{busy ? "..." : "Redeem"}</button>
        </form>
        <section className="panel" style={{ margin: 0 }}>
          <h3>Withdraw</h3>
          <label htmlFor="wd">Amount (min 10)</label>
          <input id="wd" type="number" min="10" value={wd} onChange={(e) => setWd(e.target.value)} />
          <button className="btn block mt" disabled={!wd} onClick={withdraw}>Withdraw</button>
        </section>
      </div>
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <p className="small muted" style={{ margin: "16px 0 22px" }}>Demo mode: virtual money only. Payment layer: lib/payments.js.</p>
    </>
  );
}
