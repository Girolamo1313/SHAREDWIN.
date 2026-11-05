import Link from "next/link";
import { Invader } from "@/components/Sprite";
export default function NotFound() {
  return (
    <div className="panel empty"><Invader px={6} /><h3>Game over: page not found</h3><br /><Link className="btn" href="/">Back home</Link></div>
  );
}
