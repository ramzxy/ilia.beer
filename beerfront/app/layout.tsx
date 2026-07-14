import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./ui/globals.css";
import LenisScrollProvider from "./providers/lenis-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ilia.beer"),
  title: "Ilia Beer | You buy it, I drink it",
  description:
    "Buy Ilia a beer, leave a message, and watch the stories already shared.",
  keywords: ["buy me a beer", "support", "video messages", "ilia beer"],
  authors: [{ name: "Ilia" }],
  openGraph: {
    title: "Ilia Beer | You buy it, I drink it",
    description: "Buy me a beer and watch the video proof that I drank it.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilia Beer | You buy it, I drink it",
    description: "Buy me a beer and watch the video proof that I drank it.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f3c84b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body>
        <LenisScrollProvider>{children}</LenisScrollProvider>
      </body>
    </html>
  );
}
