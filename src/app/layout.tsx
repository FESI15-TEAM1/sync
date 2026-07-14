import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sync',
  description: 'Sharing my own playlists with others on streaming platforms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
