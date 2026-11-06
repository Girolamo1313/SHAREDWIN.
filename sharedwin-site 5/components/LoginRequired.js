import Link from "next/link";
import { Invader } from "./Sprite";
export default function LoginRequired() {
  return (
    <div className="panel empty">
      <Invader px={6} />
      <p>Log in to see this page.</p>
      <Link className="btn pink blink" href="/auth">Insert coin</Link>
    </div>
  );
}
