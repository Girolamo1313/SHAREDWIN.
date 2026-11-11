// Shared pixel-art player: shows one of 5 frames (4 run frames + 1 celebration) in turn.
// Merges neighbouring pixels of the same color into one rectangle to keep the page light.
function Frame({ rows, pal, px }) {
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let n = 1;
      while (x + n < row.length && row[x + n] === c) n++;
      if (pal[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={n} height="1" fill={pal[c]} />);
      x += n;
    }
  });
  return (
    <svg className="sp" width={rows[0].length * px} height={rows.length * px} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  );
}

export default function PixelPlayer({ frames, pal, label, px = 3, fluid = false, prefix = "pf" }) {
  const w = frames[0][0].length, h = frames[0].length;
  const style = fluid ? { aspectRatio: `${w} / ${h}` } : { width: w * px, height: h * px };
  return (
    <span className={`player${fluid ? " fluid" : ""}`} role="img" aria-label={label} style={style}>
      {frames.map((rows, i) => (
        <span key={i} className={`pf ${prefix}${i + 1}`}><Frame rows={rows} pal={pal} px={px} /></span>
      ))}
    </span>
  );
}
