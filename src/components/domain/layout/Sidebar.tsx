'use client';

import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { useSidebarStore } from '@/providers/sidebar-store-provider';
import { useUserStore } from '@/providers/user-store-provider';

import SearchBar from './SearchBar';

const NAV_ITEMS = [
  { href: '/', label: '홈', isAuthOnly: false },
  { href: '/stage', label: '스테이지', isAuthOnly: false },
  { href: '/group', label: '내 그룹', isAuthOnly: true },
  { href: '/playlist', label: '내 플레이리스트', isAuthOnly: true },
] as const;

// 데스크탑 사이드바와 모바일 드로어가 공유하는 패널 스타일
const PANEL_STYLE =
  'item-center bg-bg-primary z-40 flex h-[calc(100vh_-_var(--global-header-height))] shrink-0 flex-col gap-4 px-7 py-3 shadow-xl';

// 데스크탑 고정 사이드바 — transform도 transition도 없어서 뷰포트가 바뀌어도 애니메이션할 대상이 없다.
const DESKTOP_SIDEBAR_STYLE = `${PANEL_STYLE} hidden lg:absolute lg:top-[var(--global-header-height)] lg:flex lg:w-64`;

// 모바일 드로어 — 열고 닫는 transform이 여기에만 있으므로 transition도 여기에만 둔다.
const drawerStyle = cva(
  `${PANEL_STYLE} fixed top-[var(--global-header-height)] left-0 w-full transition-transform duration-300 ease-in-out lg:hidden`,
  {
    variants: {
      isOpen: {
        true: 'translate-x-0',
        false: '-translate-x-full',
      },
    },
  },
);

const backdropStyle = cva(
  'fixed top-[var(--global-header-height)] left-0 z-30 h-[calc(100vh_-_var(--global-header-height))] w-full shrink-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden',
  {
    variants: {
      isOpen: {
        true: 'opacity-100',
        false: 'pointer-events-none opacity-0',
      },
    },
  },
);

// 드로어가 뜨는 구간 — 데스크탑(lg)에서는 드로어 자체가 숨겨지므로 스크롤을 잠그면 안 된다.
const DRAWER_MEDIA_QUERY = '(max-width: 1024px)';

const SidebarItemStyle = cva(
  'hover:font-bold font-normal transition-all duration-200 ease-in-out',
  {
    variants: {
      isCurrent: {
        true: 'text-shadow-[0_2px_15px_var(--color-primary)] text-primary font-bold',
        false: 'text-shadow-none',
      },
    },
  },
);

// 자체 메뉴가 없는 세그먼트를 활성 표시할 메뉴의 세그먼트로 옮긴다 — playroom은 스테이지에서 들어가는 하위 화면.
// Record 타입을 사용해 키와 값의 타입을 지정합니다.
const SEGMENT_ALIAS: Record<string, string> = {
  playroom: 'stage',
};

// '/group/123' -> 'group', '/' -> '' — 첫 세그먼트만 비교하므로 하위 경로에서도 활성 상태가 유지된다.
function getFirstSegment(path: string) {
  const segment = path.split('/')[1] ?? '';

  return SEGMENT_ALIAS[segment] ?? segment;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const items = NAV_ITEMS.filter((item) => !item.isAuthOnly || user !== null);

  return (
    <>
      {pathname === '/search' || !user ? null : <SearchBar />}

      <nav className="text-text-primary flex h-full flex-col gap-9 p-4">
        {items.map(({ href, label }) => {
          // 홈은 루트 경로에서만 활성 — 나머지는 첫 세그먼트가 같으면 활성
          const isCurrent =
            href === '/'
              ? pathname === '/'
              : getFirstSegment(pathname) === getFirstSegment(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              className={twMerge(SidebarItemStyle({ isCurrent }))}
              onClick={onNavigate}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);

  // 모바일 드로어가 열려 있는 동안 배경 스크롤 잠금 (뷰포트가 lg로 넓어지면 바로 해제)
  useEffect(() => {
    if (!isOpen) return;

    const mediaQuery = window.matchMedia(DRAWER_MEDIA_QUERY);

    const syncBodyOverflow = () => {
      document.body.style.overflow = mediaQuery.matches ? 'hidden' : '';
    };

    syncBodyOverflow();
    mediaQuery.addEventListener('change', syncBodyOverflow);

    return () => {
      mediaQuery.removeEventListener('change', syncBodyOverflow);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <aside className={DESKTOP_SIDEBAR_STYLE}>
        <SidebarContent />
      </aside>

      <div className={backdropStyle({ isOpen })} />

      <aside className={drawerStyle({ isOpen })}>
        <SidebarContent onNavigate={() => close()} />
      </aside>
    </>
  );
}
