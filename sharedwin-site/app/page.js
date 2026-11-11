import Link from "next/link";
import Player from "@/components/Player";
import Player9 from "@/components/Player9";
import MatchCard from "@/components/MatchCard";
import ContactForm from "@/components/ContactForm";
import SideMenu from "@/components/SideMenu";
import { getUser } from "@/lib/auth";
import { listMatches } from "@/lib/queries";
import { DEFAULT_COMMISSION_BPS, DEFAULT_MAX_PLAYERS } from "@/lib/rules";

export const metadata = {
  title: "SharedWin – Shared-pot prediction game. Pick 1, X or 2",
  description: "Everybody puts coins in the pot, winners split it. Pick 1, X or 2 on football, rugby, hockey and more. Virtual coins, no cash value. 18+.",
  alternates: { canonical: "/" },
};
export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, matches] = await Promise.all([getUser(), listMatches({ status: "open" })]);
  return (
    <>
      <SideMenu />
      <section className="panel hero">
        <div className="hero-in">
          <div className="hero-txt">
            <p className="eyebrow">The shared-pot prediction game</p>
            <div className="title-row">
              <h1>Shared<span>Win</span></h1>
              <div className="art" aria-hidden="false"><Player9 fluid /><Player fluid /></div>
            </div>
            <p className="lead">Everybody puts coins in the pot. Pick <b>1</b>, <b>X</b> or <b>2</b>. The winners split it all.</p>
            <div className="row">
              <Link className="btn pink blink" href={user ? "/matches" : "/auth"}>{user ? "Press start" : "Insert coin"}</Link>
              <Link className="btn ghost" href="/matches">See matches</Link>
            </div>
          </div>
        </div>
      </section>

      <h2>How it works</h2>
      <div className="grid g3" style={{ marginBottom: 26 }}>
        <div className="panel" style={{ margin: 0 }}><h3 className="step">1. Pick</h3><p className="mt">Choose a match and bet on <b>1</b> (home), <b>X</b> (draw) or <b>2</b> (away). One bet per match.</p></div>
        <div className="panel" style={{ margin: 0 }}><h3 className="step">2. Pool</h3><p className="mt">Max {DEFAULT_MAX_PLAYERS} players per match. All stakes go into one shared pot.</p></div>
        <div className="panel" style={{ margin: 0 }}><h3 className="step">3. Split</h3><p className="mt">After the whistle, winners share the pot (minus a fixed {DEFAULT_COMMISSION_BPS / 100}% fee) in proportion to their stake.</p></div>
      </div>

      <div className="row between"><h2 style={{ margin: 0 }}>Open matches</h2><Link className="tag" href="/matches">View all</Link></div>
      <br />
      <div className="grid g2">{matches.slice(0, 4).map((m) => <MatchCard key={m.id} m={m} />)}</div>
      {matches.length === 0 && <p className="muted">No open matches yet. Check back soon.</p>}

      <section className="panel" style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 8 }}>New here?</h2>
        <p className="muted">Learn the rules in two minutes.</p>
        <div className="chips mt">
          <Link className="chip" href="/how-it-works">How it works</Link>
          <Link className="chip" href="/faq">FAQ</Link>
          <Link className="chip" href="/glossary">Glossary</Link>
          <Link className="chip" href="/leaderboard">Leaderboard</Link>
        </div>
      </section>

      <section id="contact" className="panel contact" style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 8 }}>Contact us</h2>
        <p className="muted">A question, an idea, a problem? Send us a message and we will get back to you.</p>
        <ContactForm />
      </section>
    </>
  );
}
