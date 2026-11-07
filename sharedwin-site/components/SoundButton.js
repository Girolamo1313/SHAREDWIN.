"use client";
import { useState } from "react";
import { toggleRiff } from "@/lib/riff";

// Off by default: browsers only allow sound after a click.
export default function SoundButton() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="ibtn w" aria-label="Guitar riff on or off" onClick={() => setOn(toggleRiff())}>
      {on ? "♪ On" : "♪ Off"}
    </button>
  );
}
