import Link from "next/link";
import Logo from "./Logo";
import SoundButton from "./SoundButton";
import { Coin } from "./Sprite";
import { getUser } from "@/lib/auth";
import { fmtCoins } from "@/lib/rules";

export default async function Header() {
  const user = await getUser();
  return (
    <header>
      <div className="hbar">
        <Logo />
        <div className="hr">
          <SoundButton />
          {user ? (
            <Link className="bal" href="/wallet"><Coin px={2} />{fmtCoins(user.balance_cents)}</Link>
          ) : (
            <Link className="btn pink" style={{ padding: "10px 12px", fontSize: 12 }} href="/auth">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
