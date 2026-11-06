// Ledger helpers. Every balance change is paired with a transaction row.
export async function credit(client, userId, deltaCents, type, note) {
  // The CHECK (balance_cents >= 0) constraint makes overdrafts impossible (error 23514).
  const r = await client.query(
    "update users set balance_cents = balance_cents + $2 where id = $1 returning balance_cents",
    [userId, deltaCents]
  );
  await client.query(
    "insert into transactions (user_id, type, amount_cents, note) values ($1, $2, $3, $4)",
    [userId, type, deltaCents, note ?? null]
  );
  return r.rows[0].balance_cents;
}
