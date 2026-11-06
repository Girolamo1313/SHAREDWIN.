import { handler, json, HttpError } from "@/lib/api";
import { getMatch } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const GET = handler(async (_req, { params }) => {
  const m = await getMatch(params.id);
  if (!m) throw new HttpError(404, "Match not found.");
  return json({ match: m });
}, { auth: false });
