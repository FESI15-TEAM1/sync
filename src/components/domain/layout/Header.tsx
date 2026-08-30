'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import KebabModal from '@/components/domain/KebabModal';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';
import { useUserStore } from '@/providers/user-store-provider';
import { logout } from '@/services/auth/auth.api';

import HamburgerButton from './HamburgerButton';
import NotificationBell from './NotificationsBell';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const setUser = useUserStore((state) => state.setUser);
  const showLoading = useDelayedLoading(isLoading);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      // 계정에 묶인 캐시(내 프로필·내 플레이룸 등)가 다음 계정으로 새지 않도록 전부 비웁니다.
      queryClient.clear();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

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

  return (
    <header
      className="bg-bg-card flex-[0 0 auto] flex items-center justify-between px-4 py-4 text-center shadow-md"
      ref={headerRef}
    >
      <div className="flex items-center gap-3">
        <HamburgerButton />
        <div className="flex items-center">
          <Link className="flex items-center gap-2" href="/">
            <SyncLogo width={45} height={45} />
            <h1 className="text-text-primary text-2xl font-bold">Sync</h1>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        {isLoading ? (
          // 200ms 이상 로딩이 지속될 때만 스켈레톤 표시(짧은 로딩의 깜빡임 방지)
          <div
            className={`size-11.25 rounded-full ${showLoading ? 'animate-pulse bg-gray-300' : ''}`}
          />
        ) : user ? (
          // 로그인 상태

          <KebabModal
            triggerLabel="프로필 메뉴"
            trigger={
              user.image ? (
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
              )
            }
          >
            <KebabModal.Item
              onClick={() => router.push(`/profile/${user.id}`)}
            >
              마이페이지
            </KebabModal.Item>
            <KebabModal.Item onClick={handleLogout}>로그아웃</KebabModal.Item>
          </KebabModal>
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
