// Canonical site address. Set NEXT_PUBLIC_SITE_URL in Vercel to change it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.sharedwin.bet").replace(/\/$/, "");
export const SITE_NAME = "SharedWin";

export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const FAQ = [
  ["What is SharedWin?", "SharedWin is a shared-pot prediction game. For each market (for example a football match) you pick one outcome: 1 (home), X (draw or other) or 2 (away). Every stake goes into one shared pot, and the players who picked the right outcome split it."],
  ["Is SharedWin free to play? Is it real money?", "SharedWin is played with virtual coins that have no cash value. Coins cannot be exchanged for money, goods or services. There is no real-money gambling on the site."],
  ["How do I get coins?", "New players receive a welcome bonus. More coins can be added with a Pognon code: enter the code in your Wallet and the coins are added to your balance. Each code works once."],
  ["How are winnings calculated?", "The pot is the sum of all stakes on a market. A fixed 5% fee is taken, and the rest is shared between the winners in proportion to their stake. Amounts are rounded down."],
  ["What happens if nobody picks the winning outcome?", "All stakes are refunded and no fee is taken."],
  ["How many players can join a market?", "Each market accepts up to 100 players by default. Each player can place one bet per market, and a bet cannot be changed once placed."],
  ["When do bets close?", "Bets close at the closing time shown on the market, or earlier if the market is full."],
  ["What are the possible outcomes?", "Most markets have three outcomes: 1, X and 2. Some markets are duels with only two options, and some use custom labels instead of home, draw and away."],
  ["Who can play?", "SharedWin is for adults only (18+). You are responsible for checking that taking part is allowed where you live."],
  ["Can I customize my profile?", "Yes. You can create your own avatar: a superhero, a football shirt with your number, or an animal, in your own colors. It shows next to your name in the ranking and in the chat."],
];

export const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");
