import { cleanAvatar } from "@/lib/avatar";

const INK = "#1b0a3c";

function Hero({ v, c1, c2 }) {
  const emblem = [
    <polygon key="s" points="32,35 34,40 39.5,40.2 35.2,43.5 36.8,49 32,45.8 27.2,49 28.8,43.5 24.5,40.2 30,40" />,
    <polygon key="b" points="34,35 27,43 31,43 29,50 37,41 33,41" />,
    <circle key="c" cx="32" cy="42" r="5.5" />,
    <polygon key="t" points="32,36 38.5,48 25.5,48" />,
    <path key="h" d="M32 49 L25.5 42 A3.6 3.6 0 0 1 32 38 A3.6 3.6 0 0 1 38.5 42 Z" />,
    <polygon key="d" points="32,35 38.5,42 32,49 25.5,42" />,
  ][v];
  return (
    <>
      <path d="M19 30 L9 60 L55 60 L45 30 Z" fill={c2} />
      <rect x="22" y="52" width="8" height="9" rx="2" fill={c1} />
      <rect x="34" y="52" width="8" height="9" rx="2" fill={c1} />
      <rect x="22" y="58" width="8" height="4" fill={c2} />
      <rect x="34" y="58" width="8" height="4" fill={c2} />
      <rect x="20" y="31" width="24" height="23" rx="5" fill={c1} />
      <rect x="13" y="32" width="8" height="17" rx="4" fill={c1} />
      <rect x="43" y="32" width="8" height="17" rx="4" fill={c1} />
      <circle cx="32" cy="19" r="11" fill="#ffd2a6" />
      <path d="M21 17 A11 11 0 0 1 43 17 Z" fill={c1} />
      <rect x="21" y="15" width="22" height="8" rx="4" fill={c2} />
      <ellipse cx="27" cy="19" rx="3" ry="2" fill="#fff" />
      <ellipse cx="37" cy="19" rx="3" ry="2" fill="#fff" />
      <g fill={c2}>{emblem}</g>
    </>
  );
}

function Jersey({ v, c1, c2, num }) {
  const shirt = "M20 10 L7 19 L13 29 L20 25 L20 57 L44 57 L44 25 L51 29 L57 19 L44 10 Q32 19 20 10 Z";
  const pattern = [
    null,
    [0, 1, 2, 3].map((i) => <rect key={i} x={13 + i * 12} y="0" width="6" height="64" fill={c2} />),
    <rect key="band" x="0" y="31" width="64" height="9" fill={c2} />,
    <polygon key="sash" points="7,10 22,10 57,50 57,64 44,64 7,22" fill={c2} />,
    <rect key="half" x="32" y="0" width="32" height="64" fill={c2} />,
    [0, 1, 2].map((i) => <rect key={i} x="0" y={24 + i * 12} width="64" height="6" fill={c2} />),
  ][v];
  return (
    <>
      <clipPath id="sw-shirt"><path d={shirt} /></clipPath>
      <path d={shirt} fill={c1} />
      <g clipPath="url(#sw-shirt)">{pattern}</g>
      <path d={shirt} fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22.5 11 Q32 19 41.5 11" fill="none" stroke={c2 === c1 ? INK : c2} strokeWidth="3.2" strokeLinecap="round" />
      <text x="32" y="48" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" stroke={INK} strokeWidth="2.6" paintOrder="stroke" style={{ fontFamily: "sans-serif" }}>{num}</text>
    </>
  );
}

function Animal({ v, c1, c2 }) {
  const ears = [
    <g key="cat"><polygon points="13,26 16,6 30,17" fill={c1} /><polygon points="51,26 48,6 34,17" fill={c1} /><polygon points="17,21 18.5,11 25,16.5" fill={c2} /><polygon points="47,21 45.5,11 39,16.5" fill={c2} /></g>,
    <g key="dog"><ellipse cx="13" cy="32" rx="6.5" ry="13" fill={c2} stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" transform="rotate(12 13 32)" /><ellipse cx="51" cy="32" rx="6.5" ry="13" fill={c2} stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" transform="rotate(-12 51 32)" /></g>,
    <g key="bear"><circle cx="15" cy="20" r="8" fill={c1} /><circle cx="49" cy="20" r="8" fill={c1} /><circle cx="15" cy="20" r="4" fill={c2} /><circle cx="49" cy="20" r="4" fill={c2} /></g>,
    <g key="fox"><polygon points="12,28 14,3 31,18" fill={c1} /><polygon points="52,28 50,3 33,18" fill={c1} /><polygon points="16,20 16.5,10 24,16.5" fill={INK} /><polygon points="48,20 47.5,10 40,16.5" fill={INK} /></g>,
    <g key="rab"><ellipse cx="22" cy="12" rx="5.5" ry="14" fill={c1} /><ellipse cx="42" cy="12" rx="5.5" ry="14" fill={c1} /><ellipse cx="22" cy="13" rx="2.6" ry="10" fill={c2} /><ellipse cx="42" cy="13" rx="2.6" ry="10" fill={c2} /></g>,
    <g key="lion"><circle cx="32" cy="35" r="27" fill={c2} /><circle cx="13" cy="19" r="5" fill={c1} /><circle cx="51" cy="19" r="5" fill={c1} /></g>,
  ][v];
  const headR = v === 5 ? 18 : 20;
  const muzzle = v === 1 || v === 2 || v === 3 || v === 5;
  return (
    <>
      {ears}
      <circle cx="32" cy="36" r={headR} fill={c1} />
      {v === 3 && <polygon points="12,40 32,52 52,40 46,50 32,57 18,50" fill="#fff" />}
      {muzzle && <ellipse cx="32" cy="44" rx="9" ry="7" fill="#fff" opacity="0.88" />}
      <circle cx="25" cy="33" r="3.2" fill={INK} /><circle cx="39" cy="33" r="3.2" fill={INK} />
      <circle cx="26" cy="32" r="1" fill="#fff" /><circle cx="40" cy="32" r="1" fill="#fff" />
      <polygon points="28.5,40 35.5,40 32,44.5" fill={INK} />
      <path d="M32 44.5 Q28.5 49 25 47 M32 44.5 Q35.5 49 39 47" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      {v === 0 && <g stroke={INK} strokeWidth="1" strokeLinecap="round"><line x1="12" y1="40" x2="22" y2="42" /><line x1="12" y1="45" x2="22" y2="45" /><line x1="52" y1="40" x2="42" y2="42" /><line x1="52" y1="45" x2="42" y2="45" /></g>}
    </>
  );
}

export default function Avatar({ avatar, size = 40, label }) {
  const a = cleanAvatar(avatar);
  const Body = a.kind === "jersey" ? Jersey : a.kind === "animal" ? Animal : Hero;
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={label || "Avatar"} style={{ flex: "none" }}>
      <rect x="1" y="1" width="62" height="62" rx="14" fill={INK} stroke="#00f0ff" strokeWidth="2" />
      <g transform="translate(4 4) scale(0.875)"><Body v={a.variant} c1={a.c1} c2={a.c2} num={a.num} /></g>
    </svg>
  );
}
