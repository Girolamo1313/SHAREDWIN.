// Avatar settings shared by the editor, the API and the display component.
export const KINDS = [["hero", "Hero"], ["jersey", "Jersey"], ["animal", "Animal"]];
export const PALETTE = ["#ff2a9d", "#00f0ff", "#ffe14d", "#3dffa2", "#ff7b39", "#6a2cff", "#ffffff", "#1b0a3c"];
export const VARIANT_COUNT = 6;
export const DEFAULT_AVATAR = { kind: "hero", variant: 0, c1: "#ff2a9d", c2: "#00f0ff", num: 10 };

/** Returns a safe avatar object, whatever was stored. */
export function cleanAvatar(a) {
  const d = DEFAULT_AVATAR;
  if (!a || typeof a !== "object") return { ...d };
  const kind = KINDS.some(([k]) => k === a.kind) ? a.kind : d.kind;
  const variant = Number.isInteger(a.variant) && a.variant >= 0 && a.variant < VARIANT_COUNT ? a.variant : 0;
  const c1 = PALETTE.includes(a.c1) ? a.c1 : d.c1;
  const c2 = PALETTE.includes(a.c2) ? a.c2 : d.c2;
  const num = Number.isInteger(a.num) && a.num >= 0 && a.num <= 99 ? a.num : d.num;
  return { kind, variant, c1, c2, num };
}
