import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Image from 'next/image';

import Bell from '@/assets/icon/bell.svg'; // SVGR library
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World!!</h1>
        <h1 className="text-4xl font-bold">세상아 안녕??</h1>
      </div>
      <HomePage />
    </>
  );
}
