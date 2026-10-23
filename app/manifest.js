export default function manifest() {
  return {
    name: "GTA VI Countdown",
    short_name: "GTA VI Timer",
    description:
      "Live countdown to Grand Theft Auto VI release. Track days, hours, minutes, and seconds.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0C",
    theme_color: "#FF2D78",
    orientation: "any",
    categories: ["entertainment", "games"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
