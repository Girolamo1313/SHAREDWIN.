// Sends an e-mail through Resend (https://resend.com). Needs RESEND_API_KEY in the environment.
// Without the key nothing is sent (the function returns false), so the site keeps working.
export async function sendMail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("RESEND_API_KEY is not set: e-mail not sent."); return false; }
  const from = process.env.MAIL_FROM || "SharedWin <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error("Resend request failed", e);
    return false;
  }
}
