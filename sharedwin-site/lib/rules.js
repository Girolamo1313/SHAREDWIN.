// Pure business rules (no I/O). Shared by the server and the browser.
// All amounts are integer cents. 1 coin = 100 cents = 1 EUR (simulated).

export const STAKE_MIN_CENTS = 500;        // 5 coins
export const STAKE_MAX_CENTS = 10000;      // 100 coins
export const WELCOME_BONUS_CENTS = 50000;  // 500 coins
export const DEFAULT_COMMISSION_BPS = 500; // 5.00 %
export const DEFAULT_MAX_PLAYERS = 100;
export const PICKS = ["H", "D", "A"];      // Home (1), Draw (X), Away (2)

export const pickSymbol = (p) => (p === "H" ? "1" : p === "A" ? "2" : "X");
export const pickLabel = (m, p) => (p === "H" ? m.home : p === "A" ? m.away : (m.draw_label || "Draw"));
export const pickList = (m) => (m.has_draw === false ? ["H", "A"] : ["H", "D", "A"]);

export function fmtCoins(cents) {
  const n = cents / 100;
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Settlement rules.
 *  pool      = sum of all stakes
 *  fee       = floor(pool * commission)          (fixed commission, taken once)
 *  net       = pool - fee
 *  payout_i  = floor(stake_i * net / winStake)   (winners share net pro-rata to stake)
 *  If nobody picked the winning outcome: every stake is refunded and no fee is taken.
 * Rounding dust (a few cents) stays with the house, so we never pay out more than `net`.
 */
export function computeSettlement(bets, result, commissionBps) {
  const pool = bets.reduce((s, b) => s + b.stake_cents, 0);
  const winStake = bets.filter((b) => b.pick === result).reduce((s, b) => s + b.stake_cents, 0);

  if (winStake === 0) {
    return {
      pool, fee: 0, net: pool, winStake: 0, refunded: true,
      payouts: bets.map((b) => ({ id: b.id, user_id: b.user_id, status: "refunded", payout: b.stake_cents })),
    };
  }
  const fee = Math.floor((pool * commissionBps) / 10000);
  const net = pool - fee;
  return {
    pool, fee, net, winStake, refunded: false,
    payouts: bets.map((b) =>
      b.pick === result
        ? { id: b.id, user_id: b.user_id, status: "won", payout: Math.floor((b.stake_cents * net) / winStake) }
        : { id: b.id, user_id: b.user_id, status: "lost", payout: 0 }
    ),
  };
}

/** Estimated payout if `pick` wins, for a new stake added to the current pot. */
export function estimatePayout(totals, pick, stakeCents, commissionBps) {
  const pool = totals.H + totals.D + totals.A + stakeCents;
  const win = totals[pick] + stakeCents;
  const fee = Math.floor((pool * commissionBps) / 10000);
  return Math.floor((stakeCents * (pool - fee)) / win);
}
