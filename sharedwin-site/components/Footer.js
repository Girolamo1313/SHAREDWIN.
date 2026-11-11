import Link from "next/link";
import InstallHint from "./InstallHint";

// Short id of the version that is online (set by Vercel at build time).
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7);

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
        <InstallHint />
        <p className="small muted">SharedWin is a game played with virtual coins that have no cash value. 18+ only.</p>
        <p className="small muted">&copy; {new Date().getFullYear()} SharedWin. All rights reserved. &middot; version {BUILD}</p>
      </div>
    </footer>
  );
}
