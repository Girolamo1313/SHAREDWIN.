import Link from "next/link";
import { DEFAULT_COMMISSION_BPS, DEFAULT_MAX_PLAYERS } from "@/lib/rules";

export const metadata = { title: "Terms & Conditions – SharedWin", description: "The terms of use of SharedWin: eligibility, virtual coins, how pots and fees work, conduct and data.", alternates: { canonical: "/terms" } };

const S = ({ n, t, children }) => (
  <section className="panel legal">
    <h3>{n}. {t}</h3>
    <div className="mt">{children}</div>
  </section>
);

export default function Terms() {
  return (
    <>
      <h2>Terms &amp; Conditions</h2>
      <p className="small muted">Last updated: November 2026. These are general terms and will be updated as SharedWin evolves.</p>

      <S n="1" t="About SharedWin">
        <p>SharedWin is an online prediction game. Players put virtual coins into a shared pot on a market (for example a match with the outcomes 1, X or 2), and the players who picked the correct outcome share the pot.</p>
      </S>
      <S n="2" t="Eligibility">
        <p>You must be at least 18 years old, or the legal age of majority where you live if higher, to create an account. You are responsible for making sure that taking part is allowed where you live. One person may hold one account only.</p>
      </S>
      <S n="3" t="Virtual coins">
        <p>All coins used on SharedWin are virtual. They have no cash value, cannot be exchanged for money, goods or services, and cannot be transferred between players. Deposits and withdrawals shown in the wallet are simulated at this stage.</p>
      </S>
      <S n="4" t="How a market works">
        <p>Each market has two or three possible outcomes. Each market accepts up to {DEFAULT_MAX_PLAYERS} players by default, and each player may place one bet per market. Bets close at the closing time shown on the market, or earlier if the market is full. A bet cannot be changed or cancelled once placed.</p>
      </S>
      <S n="5" t="Pot, fee and payouts">
        <p>The pot is the sum of all stakes on a market. A fixed fee of {DEFAULT_COMMISSION_BPS / 100}% is deducted from the pot. The remaining amount is shared between the winners in proportion to their stake. If nobody picked the winning outcome, all stakes are refunded and no fee is taken. Amounts are rounded down to the smallest coin unit.</p>
      </S>
      <S n="6" t="Results">
        <p>SharedWin enters the official result of each market. In case of an obvious error, a postponed or cancelled event, or any doubt about the result, SharedWin may correct a result, void a market and refund stakes.</p>
      </S>
      <S n="7" t="Your account">
        <p>Keep your password confidential. You are responsible for all activity on your account. We may suspend or close accounts that break these terms, use automated tools, or try to cheat the system.</p>
      </S>
      <S n="8" t="Community chat and conduct">
        <p>Be respectful. Insults, harassment, spam, hate speech, illegal content and advertising are not allowed. Messages may be removed and accounts restricted at any time without notice.</p>
      </S>
      <S n="9" t="Your data">
        <p>We store the information needed to run the service: your username, e-mail address, an encrypted password, your bets and your messages. Messages sent through the contact form are used only to answer you. We do not sell your data. To ask for your data to be corrected or deleted, use the <Link href="/#contact">contact form</Link>.</p>
      </S>
      <S n="10" t="Availability and liability">
        <p>The service is provided as is. We do not guarantee that it will always be available or free of errors, and we are not liable for losses of virtual coins caused by interruptions, errors or events outside our control, to the extent permitted by law.</p>
      </S>
      <S n="11" t="Changes">
        <p>We may change these terms. The date above shows the latest version. By continuing to use SharedWin after a change, you accept the new terms.</p>
      </S>
      <S n="12" t="Contact">
        <p>Questions? Use the <Link href="/#contact">contact form</Link> on the home page.</p>
      </S>
    </>
  );
}
