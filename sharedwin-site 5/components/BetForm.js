"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";
import { estimatePayout, fmtCoins, pickSymbol, STAKE_MIN_CENTS, STAKE_MAX_CENTS } from "@/lib/rules";

export default function BetForm({ match, totals, counts, balanceCents }) {
  const router = useRouter();
  const [pick, setPick] = useState(null);
  const [stake, setStake] = useState(20);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const pool = totals.H + totals.D + totals.A;
  const stakeCents = Math.floor(Number(stake) || 0) * 100;
  const valid = pick && stakeCents >= STAKE_MIN_CENTS && stakeCents <= STAKE_MAX_CENTS && stakeCents <= balanceCents;
  const est = pick && valid ? estimatePayout(totals, pick, stakeCents, match.commission_bps) : null;

  async function submit() {
    setErr(""); setBusy(true);
    const r = await post(`/api/matches/${match.id}/bet`, { pick, stakeCoins: Math.floor(Number(stake)) });
    setBusy(false);
    if (!r.ok) return setErr(r.data.error || "Could not place bet.");
    router.refresh();
  }

  const opts = [["H", match.home], ["D", "Draw"], ["A", match.away]];
  return (
    <>
      <h2>Choose your outcome</h2>
      <div className="picks" style={{ marginBottom: 26 }}>
        {opts.map(([p, label]) => {
          const share = pool ? Math.round((totals[p] / pool) * 100) : 0;
          return (
            <button key={p} type="button" className={`pick${pick === p ? " on" : ""}`} onClick={() => setPick(p)}>
              <span className="n">{pickSymbol(p)}</span>
              <span className="t">{label}</span>
              {counts[p]} bets
              <div className="share"><i style={{ width: `${share}%` }} /></div>
              {share}% of pot
            </button>
          );
        })}
      </div>

      <section className="panel">
        <h3>Your stake</h3>
        <div className="chips mt">
          {[5, 10, 20, 50, 100].map((v) => (
            <button key={v} type="button" className={`chip${Number(stake) === v ? " on" : ""}`} onClick={() => setStake(v)}>{v}</button>
          ))}
        </div>
        <label htmlFor="stake">Custom stake (coins)</label>
        <input id="stake" type="number" min={STAKE_MIN_CENTS / 100} max={STAKE_MAX_CENTS / 100} step="1" value={stake} onChange={(e) => setStake(e.target.value)} />
        <p className="small muted mt">Min {STAKE_MIN_CENTS / 100} · Max {STAKE_MAX_CENTS / 100} · Balance {fmtCoins(balanceCents)} coins</p>
        <div className="calc" style={{ margin: "14px 0" }}>
          <div><span>Your pick</span><b>{pick ? `${pickSymbol(pick)} · ${opts.find((o) => o[0] === pick)[1]}` : "–"}</b></div>
          <div><span>Estimated payout if you win</span><b className="pos">{est !== null ? `${fmtCoins(est)} coins` : "–"}</b></div>
        </div>
        {err && <div className="notice err" role="alert">{err}</div>}
        <button className="btn pink block" disabled={!valid || busy} onClick={submit}>{busy ? "..." : "Place bet"}</button>
      </section>
    </>
  );
}
