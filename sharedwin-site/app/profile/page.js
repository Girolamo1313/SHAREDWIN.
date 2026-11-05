import Link from "next/link";
import LoginRequired from "@/components/LoginRequired";
import LogoutButton from "@/components/LogoutButton";
import { Invader } from "@/components/Sprite";
import { getUser } from "@/lib/auth";
import { userStats } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile – SharedWin" };

export default async function Profile() {
  const user = await getUser();
  if (!user) return <LoginRequired />;
  const s = await userStats(user.id);
  const total = s.pending + s.won + s.lost;
  const badges = [];
  if (total >= 1) badges.push("First bet");
  if (s.won >= 1) badges.push("First win");
  if (total >= 5) badges.push("Regular");
  if (s.net >= 10000) badges.push("High score");
  return (
    <>
      <h2>Profile</h2>
      <section className="panel">
        <div className="row"><Invader px={8} /><div><h3 style={{ fontSize: 14 }}>{user.username}</h3><p className="muted" style={{ margin: "8px 0 0" }}>Player since {new Date(user.created_at).toLocaleDateString("en-GB")}</p></div></div>
      </section>
      <section className="panel">
        <h3>Badges</h3>
        <div className="chips mt">{badges.length ? badges.map((b) => <span key={b} className="tag">{b}</span>) : <span className="muted">Play to unlock badges.</span>}</div>
      </section>
      <div className="row">
        <Link className="btn ghost" href="/history">History</Link>
        {user.is_admin && <Link className="btn ghost" href="/admin">Admin</Link>}
        <LogoutButton />
      </div>
    </>
  );
}
