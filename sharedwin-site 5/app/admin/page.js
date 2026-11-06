import AdminPanel from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/auth";
import { listMatches } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin – SharedWin" };

export default async function Admin() {
  await requireAdmin();
  const open = await listMatches({ status: "open" });
  return (
    <>
      <h2>Admin</h2>
      <p className="muted">Create matches and enter the final result. Settling pays winners automatically.</p>
      <AdminPanel open={open.map((m) => ({ id: m.id, home: m.home, away: m.away, players: m.players, pool_live: m.pool_live }))} />
    </>
  );
}
