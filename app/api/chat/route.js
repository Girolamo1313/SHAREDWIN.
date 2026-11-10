import { z } from "zod";
import { query } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { handler, readJson, json, HttpError } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  const user = await getUser();
  const rows = (await query(
    `select * from (
       select c.id, c.body, c.created_at, c.user_id, u.username, u.avatar
       from chat_messages c join users u on u.id = c.user_id
       order by c.id desc limit 50
     ) t order by id asc`
  )).rows;
  return json({
    me: user ? { id: user.id, isAdmin: !!user.is_admin } : null,
    messages: rows.map((r) => ({ id: Number(r.id), body: r.body, username: r.username, avatar: r.avatar, mine: !!user && r.user_id === user.id, at: r.created_at })),
  });
}, { auth: false });

const schema = z.object({ body: z.string().trim().min(1, "Write something first.").max(200, "200 characters max.") });

export const POST = handler(async (req, _ctx, user) => {
  const { body } = schema.parse(await readJson(req));
  const recent = (await query("select count(*)::int as n from chat_messages where user_id = $1 and created_at > now() - interval '3 seconds'", [user.id])).rows[0].n;
  if (recent > 0) throw new HttpError(429, "Slow down a little.");
  await query("insert into chat_messages (user_id, body) values ($1, $2)", [user.id, body]);
  return json({ ok: true }, 201);
});
