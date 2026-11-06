import Link from "next/link";
import { Coin } from "./Sprite";
export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="SharedWin home">
      <Coin px={3} />
      <span>Shared<b>Win</b></span>
    </Link>
  );
}
