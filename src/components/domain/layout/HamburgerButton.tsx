'use client';

import { useSidebarStore } from '@/providers/sidebar-store-provider';

export default function HamburgerButton() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <div
      onClick={toggle}
      role="button"
      aria-expanded={isOpen}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      className="relative flex h-6 w-8 cursor-pointer flex-col justify-center gap-1.5"
    >
      <span
        className={`bg-text-primary block h-0.75 w-7 rounded-xl transition-all duration-300 ${
          isOpen ? 'translate-y-2 rotate-45' : ''
        }`}
      />
      <span
        className={`bg-text-primary block h-0.75 w-7 rounded-xl transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`bg-text-primary block h-0.75 w-7 rounded-xl transition-all duration-300 ${
          isOpen ? '-translate-y-2.5 -rotate-45' : ''
        }`}
      />
    </div>
  );
}
