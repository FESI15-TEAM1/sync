'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

import Bell from '@/assets/icons/bell.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
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

  useLayoutEffect(() => {
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
      //로그아웃 성공 시에만 사용자 상태 초기화
      setUser(null);
      router.push('/');
    } catch (error) {
      // 로그아웃 실패 시 현재 로그인 상태를 유지
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
              size="md"
              variant="primary"
              onClick={handleLogout}
              isDisabled={isLoggingOut}
            >
              로그아웃
            </Button>

            <Link href={`/profile/${user.id}`}>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- 유저 업로드 CDN 호스트가 가변
                <img
                  src={user.image}
                  alt="프로필"
                  width={45}
                  height={45}
                  className="size-11.25 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="bg-input flex size-11.25 shrink-0 items-center justify-center rounded-full"
                  aria-hidden
                >
                  <SyncLogo width={24} height={24} />
                </div>
              )}
            </Link>
          </>
        ) : (
          // 로그아웃 상태
          <Link
            href="/login"
            className="bg-primary text-text-primary hover:bg-secondary rounded-3xl px-4 py-2 text-base font-bold"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
