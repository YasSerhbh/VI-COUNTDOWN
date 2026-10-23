import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "GTA VI Countdown — Days Until Grand Theft Auto 6 Release",
  description:
    "Live countdown to GTA VI release on November 19, 2026. Track days, hours, minutes, and seconds until Grand Theft Auto 6 launches.",
  keywords: [
    "GTA VI",
    "GTA 6",
    "Grand Theft Auto 6",
    "countdown",
    "release date",
    "Vice City",
  ],
  openGraph: {
    title: "GTA VI Countdown — Days Until Grand Theft Auto 6 Release",
    description:
      "Live countdown to GTA VI release. Track every second until Grand Theft Auto 6 drops.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA VI Countdown",
    description:
      "Live countdown to GTA VI release on November 19, 2026.",
  },
};

export const viewport = {
  themeColor: "#08080A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="preload" as="image" href="/bg-desktop.jpg" fetchPriority="high" />
        <link rel="preload" as="image" href="/VI.png" fetchPriority="high" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GTA VI Timer" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
