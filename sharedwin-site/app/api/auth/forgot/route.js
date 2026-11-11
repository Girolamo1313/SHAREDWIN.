import crypto from "node:crypto";
import { z } from "zod";
import { query } from "@/lib/db";
import { handler, readJson, json } from "@/lib/api";
import { sendMail } from "@/lib/mail";
import { SITE_URL } from "@/lib/seo";

const schema = z.object({ email: z.string().trim().email("Please enter a valid e-mail.").max(120) });

// Always answers the same thing, so nobody can find out which e-mails have an account.
export const POST = handler(async (req) => {
  const { email } = schema.parse(await readJson(req));
  const u = (await query("select id, email from users where email_lower = lower($1)", [email])).rows[0];
  if (u) {
    const recent = (await query("select count(*)::int as n from password_resets where user_id = $1 and created_at > now() - interval '1 hour'", [u.id])).rows[0].n;
    if (recent < 3) {
      const token = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(token).digest("hex");
      await query("insert into password_resets (user_id, token_hash, expires_at) values ($1, $2, now() + interval '1 hour')", [u.id, hash]);
      const link = `${SITE_URL}/reset-password?token=${token}`;
      await sendMail({
        to: u.email,
        subject: "Reset your SharedWin password",
        html: `<p>Hello,</p><p>Click the link below to choose a new password. It works for one hour.</p><p><a href="${link}">${link}</a></p><p>If you did not ask for this, you can ignore this e-mail.</p>`,
      });
    }
  }
  return json({ ok: true });
}, { auth: false });
