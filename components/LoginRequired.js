import Link from "next/link";
import Basketball from "./Basketball";
export default function LoginRequired() {
  return (
    <div className="panel empty">
      <Basketball px={2} />
      <p>Log in to see this page.</p>
      <Link className="btn pink blink" href="/auth">Insert coin</Link>
    </div>
  );
}
