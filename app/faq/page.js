import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { FAQ, abs } from "@/lib/seo";

const title = "SharedWin FAQ – Rules, coins, fees and payouts";
const description = "Answers to the most common questions about SharedWin: virtual coins, Pognon codes, the 5% fee, payouts and refunds.";
export const metadata = { title, description, alternates: { canonical: "/faq" }, openGraph: { title, description, url: "/faq", type: "article" } };

export default function Faq() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage", url: abs("/faq"),
        mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }} />
      <h1 style={{ fontSize: 26 }}>Frequently asked questions</h1>
      {FAQ.map(([q, a]) => (
        <section className="panel" key={q}>
          <h2 style={{ fontSize: 16, lineHeight: 1.4 }}>{q}</h2>
          <p style={{ margin: "10px 0 0", lineHeight: 1.4 }}>{a}</p>
        </section>
      ))}
      <p className="muted">More details: <Link href="/how-it-works">how it works</Link>, <Link href="/glossary">glossary</Link>, <Link href="/terms">Terms &amp; Conditions</Link>. Still stuck? <Link href="/#contact">Contact us</Link>.</p>
    </>
  );
}
