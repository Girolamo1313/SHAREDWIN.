"use client";
import { useEffect, useState } from "react";

// "Install the app" link in the footer. Chrome/Android: real install prompt.
// iPhone/iPad (Safari): shows the 2-step instructions. Hidden once the app is installed.
export default function InstallHint() {
  const [evt, setEvt] = useState(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setInstalled(!!standalone);
    setIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    const onPrompt = (e) => { e.preventDefault(); setEvt(e); };
    const onInstalled = () => { setInstalled(true); setEvt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  if (installed || (!evt && !ios)) return null;

  async function click() {
    if (evt) { evt.prompt(); try { await evt.userChoice; } catch {} setEvt(null); }
    else setTip((t) => !t);
  }
  return (
    <div className="install">
      <button type="button" className="btn pink" onClick={click}>Install the app</button>
      {tip && <p className="small install-tip">On iPhone: tap the <b>Share</b> button in Safari, then <b>Add to Home Screen</b>.</p>}
    </div>
  );
}
