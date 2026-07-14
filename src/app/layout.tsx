import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sync",
  description: "Sharing my own playlists with others on streaming platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
