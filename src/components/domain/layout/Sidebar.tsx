'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useSidebarStore } from '@/providers/sidebar-store-provider';
import { useUserStore } from '@/providers/user-store-provider';

import SearchBar from './SearchBar';

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);
  const user = useUserStore((state) => state.user);

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
        } fixed top-[var(--global-header-height)] left-0 z-30 h-[calc(100vh_-_var(--global-header-height))] w-full shrink-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden`}
      />

      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } item-center bg-bg-primary fixed top-[var(--global-header-height)] z-40 flex h-[calc(100vh_-_var(--global-header-height))] w-full shrink-0 flex-col gap-4 px-7 py-3 shadow-xl transition-transform duration-300 ease-in-out lg:absolute lg:w-64 lg:max-w-64 lg:translate-x-0`}
      >
        {pathname === '/search' ? '' : <SearchBar />}

        <div className="text-text-primary text- flex h-full flex-col gap-9 p-4">
          {user !== null ? (
            <>
              <Link
                href={'/'}
                className={`${checkSamePathname('/', pathname)}`}
                onClick={() => close()}
              >
                홈
              </Link>
              <Link
                href={'/stage'}
                className={`${checkSamePathname('/stage', pathname)}`}
                onClick={() => close()}
              >
                스테이지
              </Link>
              <Link
                href={'/group'}
                className={`${checkSamePathname('/group', pathname)}`}
                onClick={() => close()}
              >
                내 그룹
              </Link>
              <Link
                href={'/playlist'}
                className={`${checkSamePathname('/playlist', pathname)}`}
                onClick={() => close()}
              >
                내 플레이리스트
              </Link>{' '}
            </>
          ) : (
            <>
              <Link
                href={'/'}
                className={`${checkSamePathname('/', pathname)}`}
                onClick={() => close()}
              >
                홈
              </Link>{' '}
              <Link
                href={'/stage'}
                className={`${checkSamePathname('/stage', pathname)}`}
                onClick={() => close()}
              >
                스테이지
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
