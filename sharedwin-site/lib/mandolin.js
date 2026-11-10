// Mandolin tune (Web Audio, no audio file): a short tarantella-style melody in A minor,
// played with the fast tremolo picking typical of a mandolin.

const EIGHTH = 0.15;      // seconds per eighth note
const PICK = 0.065;       // time between two picks of the tremolo
// [midi note, length in eighths]
const MELODY = [
  // bar 1
  [69, 1], [72, 1], [76, 1], [72, 1], [69, 1], [72, 1],
  // bar 2
  [76, 1], [81, 1], [76, 1], [72, 1], [76, 2],
  // bar 3
  [74, 1], [77, 1], [74, 1], [71, 1], [74, 1], [77, 1],
  // bar 4 (leading tone G#, back to E)
  [76, 1], [71, 1], [68, 1], [71, 1], [76, 2],
  // bar 5: climb
  [72, 1], [76, 1], [81, 1], [84, 1], [81, 1], [76, 1],
  // final: A held
  [69, 6],
];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

/** One plucked note: two slightly detuned strings (like a real mandolin course). */
function pluck(ctx, out, t, freq, vol) {
  [-4, 4].forEach((cents) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    o.detune.value = cents;
    const o2 = ctx.createOscillator();      // a little brightness on the attack
    o2.type = "sawtooth";
    o2.frequency.value = freq * 2;
    o2.detune.value = cents;
    const bright = ctx.createGain();
    bright.gain.value = 0.18;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); o2.connect(bright); bright.connect(g);
    g.connect(out);
    o.start(t); o2.start(t);
    o.stop(t + 0.25); o2.stop(t + 0.25);
  });
}

/** Schedules the whole tune on a context starting at time t0. Returns the end time. */
export function scheduleMandolin(ctx, t0) {
  const out = ctx.createGain();
  out.gain.value = 0.3;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 5200;
  out.connect(lp); lp.connect(ctx.destination);
  let t = t0;
  MELODY.forEach(([midi, len]) => {
    const dur = len * EIGHTH;
    const picks = Math.max(1, Math.round(dur / PICK));
    for (let i = 0; i < picks; i++) {
      // the first pick of each note is a little stronger, as when the note is struck
      pluck(ctx, out, t + i * (dur / picks), hz(midi), i === 0 ? 0.5 : 0.34);
    }
    t += dur;
  });
  out.gain.setValueAtTime(0.3, t);
  out.gain.linearRampToValueAtTime(0.0001, t + 0.5);
  return t + 0.5;
}

let ctx = null;

/** Plays the tune once. If the browser blocks sound, it stays silent: no error. Returns a stop function. */
export function playMandolin() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return () => {};
    ctx = new Ctx();
    const c = ctx;
    const go = () => { if (c.state === "closed") return; scheduleMandolin(c, c.currentTime + 0.05); };
    if (c.state === "suspended") c.resume().then(go).catch(() => {}); else go();
    return () => { try { c.close(); } catch {} };
  } catch {
    return () => {};
  }
}
