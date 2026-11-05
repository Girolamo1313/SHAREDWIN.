// Payment provider boundary. MVP = simulated (no real money).
//
// To go live with Stripe:
//  1. npm i stripe
//  2. Replace `deposit` with a Checkout Session creation and return its URL.
//  3. Credit the wallet ONLY from a verified webhook (checkout.session.completed)
//     by calling `credit(client, userId, cents, "deposit", "Stripe")`.
//  4. Withdrawals: Stripe Connect payouts + KYC/AML checks before releasing funds.
export const provider = {
  name: "simulated",
  async deposit({ amountCents }) {
    return { status: "succeeded", amountCents };
  },
  async withdraw({ amountCents }) {
    return { status: "succeeded", amountCents };
  },
};
