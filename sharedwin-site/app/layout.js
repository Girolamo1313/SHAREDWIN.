import "./globals.css";
import { Audiowide, Rajdhani } from "next/font/google";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, abs } from "@/lib/seo";

const px = Audiowide({ weight: "400", subsets: ["latin"], variable: "--font-px", display: "swap" });
const body = Rajdhani({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SharedWin – Shared-pot prediction game. Pick 1, X or 2",
  description: "Everybody puts coins in the pot, winners split it. Pick 1, X or 2 on football, rugby, hockey and more. Virtual coins, no cash value. 18+.",
  applicationName: "SharedWin",
  openGraph: { type: "website", siteName: "SharedWin", title: "SharedWin – Everybody plays, winners split the pot", description: "A shared-pot prediction game. Pick 1, X or 2 and split the pot with the other winners.", url: "/", locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630, alt: "SharedWin" }] },
  twitter: { card: "summary_large_image", title: "SharedWin – Everybody plays, winners split the pot", description: "A shared-pot prediction game. Pick 1, X or 2.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${px.variable} ${body.variable}`}>
      <body>
        <JsonLd data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: "SharedWin", url: abs("/"), inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Organization", name: "SharedWin", url: abs("/"), logo: abs("/icon.svg") },
        ]} />
        <div id="crt" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatBox />
        <BottomNav />
      </body>
    </html>
  );
}
