import AdminPanel from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/auth";
import { listMatches } from "@/lib/queries";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin – SharedWin", robots: { index: false, follow: false } };

export default async function Admin() {
  await requireAdmin();
  const open = await listMatches({ status: "open" });
  const codes = (await query(
    `select p.code, p.amount_cents, u.username as used_by_name
     from pognon_codes p left join users u on u.id = p.used_by
     order by p.created_at desc, p.code limit 40`
  )).rows;
  const messages = (await query("select id, name, email, message, created_at from contact_messages order by created_at desc limit 30")).rows
    .map((x) => ({ ...x, created_at: new Date(x.created_at).toISOString() }));
  return (
    <>
      <h2>Admin</h2>
      <p className="muted">Create markets and enter the final result. Settling pays winners automatically.</p>
      <AdminPanel open={open.map((m) => ({ id: m.id, home: m.home, away: m.away, players: m.players, pool_live: m.pool_live, has_draw: m.has_draw, draw_label: m.draw_label, title: m.title }))} messages={messages} codes={codes} />
    </>
  );
}
