// Web app manifest: lets players install SharedWin on their phone's home screen.
export default function manifest() {
  return {
    name: "SharedWin",
    short_name: "SharedWin",
    description: "A shared-pot prediction game. Pick 1, X or 2 and split the pot with the winners.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#150636",
    theme_color: "#150636",
    lang: "en",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
