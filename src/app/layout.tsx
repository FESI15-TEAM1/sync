import './globals.css';

import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'Sync',
  description: 'Sharing my own playlists with others on streaming platforms.',
};

import { type ReactNode } from 'react';

import Header from '@/components/domain/layout/Header';
import Sidebar from '@/components/domain/layout/Sidebar';
import { CounterStoreProvider } from '@/providers/counter-store-provider';

const noto = Noto_Sans({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto-sans',
  display: 'swap',
});
const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2', // 레이아웃 위치 기준 상대 경로
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`h-full antialiased ${pretendard.variable} ${noto.variable}`}
    >
      <body className={`bg-bg-primary flex min-h-full flex-col`}>
        <Header />
        <Sidebar initialOpen={false} />
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  );
}
