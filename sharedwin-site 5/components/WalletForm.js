"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

export default function WalletForm() {
  const router = useRouter();
  const [dep, setDep] = useState("");
  const [wd, setWd] = useState("");
  const [msg, setMsg] = useState(null);

  async function go(kind, value, reset) {
    setMsg(null);
    const r = await post(`/api/wallet/${kind}`, { amountCoins: Math.floor(Number(value)) });
    if (!r.ok) return setMsg({ err: true, text: r.data.error || "Failed." });
    reset("");
    setMsg({ err: false, text: kind === "deposit" ? "Coins added (demo)." : "Withdrawal requested (demo)." });
    router.refresh();
  }

  return (
    <>
      <div className="grid g2">
        <section className="panel" style={{ margin: 0 }}>
          <h3>Deposit</h3>
          <div className="chips mt">{[10, 25, 50, 100].map((v) => <button key={v} type="button" className="chip" onClick={() => go("deposit", v, setDep)}>+{v}</button>)}</div>
          <label htmlFor="dep">Amount</label>
          <input id="dep" type="number" min="1" max="1000" value={dep} onChange={(e) => setDep(e.target.value)} />
          <button className="btn block mt" disabled={!dep} onClick={() => go("deposit", dep, setDep)}>Add coins</button>
        </section>
        <section className="panel" style={{ margin: 0 }}>
          <h3>Withdraw</h3>
          <label htmlFor="wd">Amount (min 10)</label>
          <input id="wd" type="number" min="10" value={wd} onChange={(e) => setWd(e.target.value)} />
          <button className="btn block mt" disabled={!wd} onClick={() => go("withdraw", wd, setWd)}>Withdraw</button>
        </section>
      </div>
      {msg && <div className={`notice${msg.err ? " err" : ""}`} role="status">{msg.text}</div>}
      <p className="small muted" style={{ margin: "16px 0 22px" }}>Demo mode: no real money. The payment layer (lib/payments.js) is isolated so Stripe can be plugged in later.</p>
    </>
  );
}
