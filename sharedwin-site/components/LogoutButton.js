"use client";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button className="btn ghost" onClick={async () => { await post("/api/auth/logout"); router.push("/"); router.refresh(); }}>
      Log out
    </button>
  );
}
