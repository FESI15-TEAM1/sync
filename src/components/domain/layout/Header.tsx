'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Bell from '@/assets/icons/bell.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import initImage from '@/assets/images/mook.jpg';
import Button from '@/components/Button';
import { useUserStore } from '@/providers/user-store-provider';
import { logout } from '@/services/auth/auth.api';

import HamburgerButton from './HamburgerButton';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
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

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // 네트워크 실패여도 클라이언트 세션은 종료한다.
    } finally {
      setUser(null);
      setIsLoggingOut(false);
      router.push('/');
    }
  };

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
        {isLoading ? (
          // 인증 상태 확인 중
          <div className="h-[45px] w-[45px] animate-pulse rounded-full bg-gray-300" />
        ) : user ? (
          // 로그인 상태
          <>
            <Button
              type="button"
              onClick={handleLogout}
              isDisabled={isLoggingOut}
              className="text-text-secondary hover:text-text-primary text-sm disabled:opacity-50"
            >
              로그아웃
            </Button>

            <Link href={`/profile/${user.id}`}>
              <Image
                src={defaultImage}
                alt="프로필"
                width={45}
                height={45}
                className="rounded-full"
              />
            </Link>
          </>
        ) : (
          // 로그아웃 상태
          <Link
            href="/login"
            className="text-text-secondary hover:text-text-primary text-sm"
          >
            <Button>로그인</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
