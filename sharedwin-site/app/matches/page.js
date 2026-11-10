import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import { listMatches, listSports } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Open markets – Pick 1, X or 2 | SharedWin", description: "Browse open prediction markets on football, rugby, hockey and more. Pick your outcome and share the pot with the winners.", alternates: { canonical: "/matches" } };

export default async function Matches({ searchParams }) {
  const sport = typeof searchParams?.sport === "string" ? searchParams.sport : undefined;
  const [matches, sports] = await Promise.all([listMatches({ sport }), listSports()]);
  return (
    <>
      <h2>Matches</h2>
      <div className="chips" style={{ marginBottom: 20 }}>
        <Link className={`chip${!sport ? " on" : ""}`} href="/matches">All</Link>
        {sports.map((s) => <Link key={s} className={`chip${sport === s ? " on" : ""}`} href={`/matches?sport=${encodeURIComponent(s)}`}>{s}</Link>)}
      </div>
      <div className="grid g2">{matches.map((m) => <MatchCard key={m.id} m={m} />)}</div>
      {matches.length === 0 && <p className="muted">No matches found.</p>}
    </>
  );
}
