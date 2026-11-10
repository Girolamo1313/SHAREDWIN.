import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/seo";
import { DEFAULT_COMMISSION_BPS, DEFAULT_MAX_PLAYERS } from "@/lib/rules";

const title = "How SharedWin works – Shared-pot prediction game";
const description = "Pick 1, X or 2, put coins in the shared pot and split it with the other winners. Learn the rules, the 5% fee and see a worked example.";
export const metadata = { title, description, alternates: { canonical: "/how-it-works" }, openGraph: { title, description, url: "/how-it-works", type: "article" } };

export default function HowItWorks() {
  const fee = DEFAULT_COMMISSION_BPS / 100;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: abs("/how-it-works"), isPartOf: { "@type": "WebSite", name: "SharedWin", url: abs("/") } }} />
      <h1 style={{ fontSize: 26 }}>How SharedWin works</h1>
      <p className="lead">SharedWin is a shared-pot prediction game: everybody puts coins in the pot, and the players who called it right split it.</p>

      <section className="panel">
        <h2 style={{ fontSize: 18 }}>The three steps</h2>
        <ol className="legal" style={{ paddingLeft: 22, lineHeight: 1.5 }}>
          <li><b>Pick.</b> Choose an open <Link href="/matches">market</Link> and pick one outcome: 1 (home), X (draw or other) or 2 (away). One bet per market.</li>
          <li><b>Pool.</b> Up to {DEFAULT_MAX_PLAYERS} players join each market. All stakes go into one shared pot.</li>
          <li><b>Split.</b> When the result is known, the winners share the pot, minus a fixed {fee}% fee, in proportion to their stake.</li>
        </ol>
      </section>

      <section className="panel">
        <h2 style={{ fontSize: 18 }}>A worked example</h2>
        <p>Imagine a pot of 1,000 coins. The fee is {fee}%, which is 50 coins, so 950 coins are left to share.</p>
        <p>Two players picked the winning outcome: Alex staked 100 coins and Sam staked 300 coins. Together the winners staked 400 coins.</p>
        <p>Alex receives 100 / 400 of 950, which is <b>237.5 coins</b>. Sam receives 300 / 400 of 950, which is <b>712.5 coins</b>.</p>
        <p>The more you stake on the right outcome, and the fewer other players picked it, the bigger your share.</p>
      </section>

      <section className="panel">
        <h2 style={{ fontSize: 18 }}>Good to know</h2>
        <ul style={{ paddingLeft: 22, lineHeight: 1.5 }}>
          <li>If nobody picked the winning outcome, every stake is refunded and no fee is taken.</li>
          <li>Coins are virtual and have no cash value. See the <Link href="/terms">Terms &amp; Conditions</Link>.</li>
          <li>Get coins with a Pognon code, then climb the <Link href="/leaderboard">leaderboard</Link>.</li>
          <li>Unsure about a word? Check the <Link href="/glossary">glossary</Link> or the <Link href="/faq">FAQ</Link>.</li>
        </ul>
      </section>

      <div className="row">
        <Link className="btn pink" href="/matches">See open markets</Link>
        <Link className="btn ghost" href="/auth">Create an account</Link>
      </div>
    </>
  );
}
