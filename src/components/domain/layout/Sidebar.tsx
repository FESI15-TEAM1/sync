'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useSidebarStore } from '@/providers/sidebar-store-provider';

import SearchBar from './SearchBar';

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const checkSamePathname = (currentPathname: string, pathname: string) => {
    const classname =
      currentPathname == pathname ? 'font-bold' : 'inline-block';
    return classname;
  };

  return (
    <>
      <div
        className={`${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        } fixed top-20 left-0 z-30 h-[calc(100vh-5rem)] w-full bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden`}
      />

      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } item-center bg-bg-primary fixed top-20 z-40 float-start flex h-screen w-full flex-col gap-4 px-7 py-3 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:w-64 lg:translate-x-0 lg:px-1`}
      >
        <SearchBar />
        <div className="text-text-primary text- flex flex-col gap-9 p-4">
          <Link href={'/'} className={`${checkSamePathname('/', pathname)}`}>
            홈
          </Link>
          <Link
            href={'/stage'}
            className={`${checkSamePathname('/stage', pathname)}`}
          >
            스테이지
          </Link>
          <Link
            href={'/group'}
            className={`${checkSamePathname('/group', pathname)}`}
          >
            내 그룹
          </Link>
          <Link
            href={'/playlist'}
            className={`${checkSamePathname('/playlist', pathname)}`}
          >
            내 플레이리스트
          </Link>
        </div>
      </div>
    </>
  );
}
