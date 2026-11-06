import test from "node:test";
import assert from "node:assert/strict";
import { computeSettlement, estimatePayout } from "../lib/rules.js";

const bet = (id, pick, coins) => ({ id, user_id: "u" + id, pick, stake_cents: coins * 100 });

test("winners split the net pot pro-rata to stake", () => {
  const bets = [bet(1, "H", 40), bet(2, "H", 60), bet(3, "A", 100), bet(4, "D", 100)];
  const s = computeSettlement(bets, "H", 500);
  assert.equal(s.pool, 30000);
  assert.equal(s.fee, 1500);
  assert.equal(s.net, 28500);
  assert.equal(s.winStake, 10000);
  assert.equal(s.payouts[0].payout, 11400);
  assert.equal(s.payouts[1].payout, 17100);
  assert.equal(s.payouts[2].status, "lost");
  const paid = s.payouts.reduce((a, p) => a + p.payout, 0);
  assert.ok(paid <= s.net);
});

test("never pays out more than the net pot (rounding dust stays with the house)", () => {
  const bets = [bet(1, "H", 7), bet(2, "H", 13), bet(3, "H", 29), bet(4, "A", 51)];
  const s = computeSettlement(bets, "H", 500);
  const paid = s.payouts.reduce((a, p) => a + p.payout, 0);
  assert.ok(paid <= s.net);
  assert.ok(s.net - paid < 3);
});

test("no winners: everybody is refunded, no fee", () => {
  const bets = [bet(1, "H", 10), bet(2, "A", 20)];
  const s = computeSettlement(bets, "D", 500);
  assert.equal(s.refunded, true);
  assert.equal(s.fee, 0);
  assert.deepEqual(s.payouts.map((p) => p.payout), [1000, 2000]);
});

test("estimate matches the real settlement when nothing else changes", () => {
  const totals = { H: 4000, D: 1000, A: 5000 };
  const est = estimatePayout(totals, "H", 1000, 500);
  const s = computeSettlement([bet(1, "H", 40), bet(2, "D", 10), bet(3, "A", 50), bet(4, "H", 10)], "H", 500);
  assert.equal(est, s.payouts.find((p) => p.id === 4).payout);
});
