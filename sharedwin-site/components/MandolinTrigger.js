"use client";
import { useEffect } from "react";
import { playMandolin } from "@/lib/mandolin";

// Plays the mandolin tune when an Italian match is opened. Renders nothing.
export default function MandolinTrigger() {
  useEffect(() => {
    const stop = playMandolin();
    return stop;
  }, []);
  return null;
}
