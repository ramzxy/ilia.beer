import "./ui/globals.css";
import LenisScrollProvider from "./providers/lenis-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LenisScrollProvider>{children}</LenisScrollProvider>
      </body>
    </html>
  );
}
