import "./globals.css";
import { Audiowide, Rajdhani } from "next/font/google";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const px = Audiowide({ weight: "400", subsets: ["latin"], variable: "--font-px", display: "swap" });
const body = Rajdhani({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
  title: "SharedWin – Everybody bets, winners split the pot",
  description: "A shared-pot prediction game. Pick 1, X or 2. Winners split the pot.",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${px.variable} ${body.variable}`}>
      <body>
        <div id="crt" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
