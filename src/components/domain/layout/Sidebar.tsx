'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import SearchBar from './SearchBar';

export default function Sidebar({ initialOpen }: { initialOpen: boolean }) {
  const pathname = usePathname();
  const [isopen, setIsopen] = useState(initialOpen);

  useEffect(() => {
    if (isopen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isopen]);

  const checkSamePathname = (currentPathname: string, pathname: string) => {
    const classname =
      currentPathname == pathname ? 'font-bold' : 'inline-block';
    return classname;
  };

  return (
    <div
      className={`${isopen ? 'block' : 'hidden'} item-center bg-bg-primary fixed top-0 z-50 float-start flex h-screen w-full translate-0 flex-col gap-4 px-7 py-3`}
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
  );
}
