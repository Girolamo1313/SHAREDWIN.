import Link from "next/link";
import ResetForm from "@/components/ResetForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "New password – SharedWin", robots: { index: false, follow: false } };

export default function ResetPassword({ searchParams }) {
  const token = typeof searchParams?.token === "string" ? searchParams.token : "";
  if (!token) return (
    <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <p>This link is incomplete. <Link href="/forgot-password">Ask for a new one</Link>.</p>
    </div>
  );
  return <ResetForm token={token} />;
}
