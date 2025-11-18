import type { Metadata } from "next";
import "./ui/globals.css";
import LenisScrollProvider from "./providers/lenis-provider";

export const metadata: Metadata = {
  title: "Buy Me a Beer | ilia.beer",
  description: "Order a beer and write a message for me. Share your thoughts and support!",
  keywords: ["buy me a beer", "support", "donations", "community"],
  authors: [{ name: "Ilia" }],
  openGraph: {
    title: "Buy Me a Beer | ilia.beer",
    description: "Order a beer and write a message for me. Share your thoughts and support!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Me a Beer | ilia.beer",
    description: "Order a beer and write a message for me. Share your thoughts and support!",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <LenisScrollProvider>{children}</LenisScrollProvider>
      </body>
    </html>
  );
}
