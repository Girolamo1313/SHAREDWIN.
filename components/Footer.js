import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-in">
        <div className="foot-links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/#contact">Contact us</Link>
        </div>
        <p className="small muted">SharedWin is a game played with virtual coins that have no cash value. 18+ only.</p>
        <p className="small muted">© {new Date().getFullYear()} SharedWin. All rights reserved.</p>
      </div>
    </footer>
  );
}
