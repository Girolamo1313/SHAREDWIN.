import { handler, json } from "@/lib/api";

export const dynamic = "force-dynamic";
export const GET = handler(async (_req, _ctx, user) => {
  return json({ id: user.id, username: user.username, balanceCents: user.balance_cents, isAdmin: user.is_admin });
});
