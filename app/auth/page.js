import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { Invader } from "@/components/Sprite";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log in – SharedWin", robots: { index: false, follow: false } };

export default async function AuthPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <>
      <div className="row" style={{ justifyContent: "center", marginBottom: 16 }}><Invader px={6} /></div>
      <AuthForm />
    </>
  );
}
