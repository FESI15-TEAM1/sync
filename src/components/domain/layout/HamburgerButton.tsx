'use client';

import { useState } from 'react';

export default function HamburgerButton({
  initialOpen = false,
}: {
  initialOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  return (
    <div
      onClick={handleToggle}
      role="button"
      aria-expanded={isOpen}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      className="relative flex h-6 w-8 cursor-pointer flex-col justify-center gap-1.5"
    >
      <span
        className={`bg-text-primary block h-1 w-8 rounded-xl transition-all duration-300 ${
          isOpen ? 'translate-y-2.5 rotate-45' : ''
        }`}
      />
      <span
        className={`bg-text-primary block h-1 w-8 rounded-xl transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`bg-text-primary block h-1 w-8 rounded-xl transition-all duration-300 ${
          isOpen ? '-translate-y-2.5 -rotate-45' : ''
        }`}
      />
    </div>
  );
}
