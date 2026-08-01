'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';

import Bell from '@/assets/icons/bell.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import initImage from '@/assets/images/mook.jpg';
import { useUserStore } from '@/providers/user-store-provider';

import HamburgerButton from './HamburgerButton';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const user = useUserStore((state) => state.user);

  useLayoutEffect(() => {
    // 페이지 렌더링 직전에 header의 높이값을 가져오기 위해 useEffect 대신 useLayoutEffect를 사용합니다
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const observer = new ResizeObserver(([entry]) => {
      const height = entry.target.clientHeight;
      document.documentElement.style.setProperty(
        '--global-header-height',
        `${height}px`,
      );
    });

    observer.observe(headerElement);
    return () => {
      observer.disconnect();
    };
  }, []);

  const defaultImage = initImage;

  return (
    <header
      className="bg-bg-card flex-[0 0 auto] flex items-center justify-between px-4 py-4 text-center shadow-md"
      ref={headerRef}
    >
      <div className="flex items-center gap-3">
        <HamburgerButton />
        <div className="flex items-center">
          <SyncLogo width={45} height={45} />
          <span className="text-text-primary text-2xl font-bold">Sync</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Bell width={30} height={30} color={'white'} />
        <Link href={user ? `/profile/${user.id}` : '/login'}>
          <Image
            src={defaultImage}
            alt="기본이미지"
            width={45}
            height={45}
            className="rounded-full"
          />
        </Link>
      </div>
    </header>
  );
}
