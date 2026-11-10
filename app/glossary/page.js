import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/seo";

const TERMS = [
  ["1 X 2", "The three classic outcomes of a match: 1 is a home win, X is a draw, 2 is an away win."],
  ["Market", "A single question players can bet on, for example one match. Each market has two or three possible outcomes."],
  ["Outcome", "One of the possible answers in a market. You pick exactly one outcome per market."],
  ["Stake", "The number of coins you put on your pick."],
  ["Pot (or pool)", "The sum of all stakes placed on a market by all players."],
  ["Fee", "A fixed 5% share of the pot kept by SharedWin before the winners are paid."],
  ["Net pot", "The pot after the fee has been removed. This is the amount shared between the winners."],
  ["Payout", "What a winner receives: their stake divided by the total winning stakes, multiplied by the net pot."],
  ["Settlement", "The moment the result is entered and winners are paid."],
  ["Refund", "If nobody picked the winning outcome, all stakes are given back and no fee is taken."],
  ["Coins", "The virtual currency used on SharedWin. Coins have no cash value."],
  ["Pognon", "The name of SharedWin's virtual payment method. A Pognon code adds coins to your wallet."],
  ["Leaderboard", "The ranking of players by net winnings."],
];
const title = "SharedWin glossary – 1 X 2, pot, stake, fee and more";
const description = "Plain-English definitions of the words used on SharedWin: market, outcome, stake, pot, net pot, fee, payout and settlement.";
export const metadata = { title, description, alternates: { canonical: "/glossary" }, openGraph: { title, description, url: "/glossary", type: "article" } };

export default function Glossary() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "DefinedTermSet", name: "SharedWin glossary", url: abs("/glossary"),
        hasDefinedTerm: TERMS.map(([t, d]) => ({ "@type": "DefinedTerm", name: t, description: d })),
      }} />
      <h1 style={{ fontSize: 26 }}>Glossary</h1>
      <dl>
        {TERMS.map(([t, d]) => (
          <section className="panel" key={t}>
            <dt style={{ fontFamily: "var(--px)", fontSize: 14, color: "#ffe14d" }}>{t}</dt>
            <dd style={{ margin: "8px 0 0", lineHeight: 1.4 }}>{d}</dd>
          </section>
        ))}
      </dl>
      <p className="muted">Read <Link href="/how-it-works">how it works</Link> or the <Link href="/faq">FAQ</Link>, then <Link href="/matches">pick a market</Link>.</p>
    </>
  );
}
