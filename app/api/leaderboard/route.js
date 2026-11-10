import { handler, json } from "@/lib/api";
import { leaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const GET = handler(async () => json({ rows: await leaderboard() }), { auth: false });
