"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const ITEMS = [
  ["/", "home", "Home"],
  ["/matches", "list", "Matches"],
  ["/dashboard", "bars", "Stats"],
  ["/leaderboard", "cup", "Ranking"],
  ["/wallet", "wallet", "Wallet"],
  ["/profile", "user", "Profile"],
];

export default function BottomNav() {
  const path = usePathname();
  const active = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav className="bnav" aria-label="Main">
      <div>
        {ITEMS.map(([href, icon, label]) => (
          <Link key={href} href={href} className={active(href) ? "on" : ""}>
            <Icon name={icon} /> {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
