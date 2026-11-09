import crypto from "node:crypto";

// No 0/O/1/I/L: codes are easy to read and type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateCode() {
  const bytes = crypto.randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return `PGN-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Accepts "pgn-abcd-2345", "PGN ABCD 2345", "PGNABCD2345"... returns "PGN-ABCD-2345" or null. */
export function normalizeCode(input) {
  const s = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length !== 11 || !s.startsWith("PGN")) return null;
  return `PGN-${s.slice(3, 7)}-${s.slice(7)}`;
}
