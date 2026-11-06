import LoginRequired from "@/components/LoginRequired";
import WalletForm from "@/components/WalletForm";
import { Coin } from "@/components/Sprite";
import { getUser } from "@/lib/auth";
import { listTransactions } from "@/lib/queries";
import { fmtCoins } from "@/lib/rules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wallet – SharedWin" };

export default async function Wallet() {
  const user = await getUser();
  if (!user) return <LoginRequired />;
  const txs = await listTransactions(user.id);
  return (
    <>
      <h2>Wallet</h2>
      <section className="panel" style={{ background: "var(--panel2)" }}>
        <span className="small muted">Balance</span>
        <div className="row mt"><Coin px={6} /><span style={{ fontFamily: "var(--px)", fontSize: 24 }}>{fmtCoins(user.balance_cents)}</span></div>
        <p className="small muted mt">1 coin = 1 EUR (simulated)</p>
      </section>
      <WalletForm />
      <h2>Transactions</h2>
      {txs.length === 0 && <p className="muted">No transactions yet.</p>}
      {txs.map((t) => (
        <div className="lrow" key={t.id}>
          <div className="nm" style={{ textTransform: "capitalize" }}>{t.type}<br /><span className="small muted" style={{ textTransform: "none" }}>{t.note} · {new Date(t.created_at).toLocaleString("en-GB")}</span></div>
          <div className={`am ${t.amount_cents >= 0 ? "pos" : "neg"}`}>{t.amount_cents >= 0 ? "+" : ""}{fmtCoins(t.amount_cents)}</div>
        </div>
      ))}
    </>
  );
}
