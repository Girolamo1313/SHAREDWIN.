import { handler, json } from "@/lib/api";
import { listMatches } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const GET = handler(async () => json({ matches: await listMatches() }), { auth: false });
