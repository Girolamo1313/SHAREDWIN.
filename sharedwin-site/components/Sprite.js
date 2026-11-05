function Sprite({ rows, pal, px }) {
  const h = rows.length, w = rows[0].length, rects = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (pal[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={pal[c]} />);
  }));
  return (
    <svg className="sp" width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  );
}
const COIN = ["..oooo..", ".oyyyyo.", "oyywyydo", "oyywyydo", "oyyyyydo", "oyyyyydo", ".oyyydo.", "..oooo.."];
const INV = ["..x.....x..", "...x...x...", "..xxxxxxx..", ".xx.xxx.xx.", "xxxxxxxxxxx", "x.xxxxxxx.x", "x.x.....x.x", "...xx.xx..."];
const TROPHY = ["yyyyyyyyyy", "yywwyyyyyy", "yywyyyyyyy", "dyyyyyyyyd", ".dyyyyyyd.", "..dyyyyd..", "....yy....", "...dyyd...", "..dddddd.."];

export const Coin = ({ px = 3 }) => <Sprite rows={COIN} pal={{ o: "#20221c", y: "#5b5f50", d: "#20221c", w: "#c9cdbd" }} px={px} />;
export const Invader = ({ px = 4, color = "#5b5f50" }) => <Sprite rows={INV} pal={{ x: color }} px={px} />;
export const Trophy = ({ px = 5 }) => <Sprite rows={TROPHY} pal={{ y: "#5b5f50", d: "#20221c", w: "#c9cdbd" }} px={px} />;
