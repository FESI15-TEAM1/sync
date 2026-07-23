import Image from 'next/image';

import Bell from '@/assets/icons/bell.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import initImage from '@/assets/images/mook.jpg';

import HamburgerButton from './HamburgerButton';

export default function Header() {
  const defaultImage = initImage;

  return (
    <div className="bg-bg-card z-50 flex items-center justify-between px-4 py-4 text-center shadow-md">
      <div className="flex items-center gap-3">
        <HamburgerButton />
        <div className="flex items-center">
          <SyncLogo width={45} height={45} />
          <span className="text-text-primary text-2xl font-bold">Sync</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Bell width={30} height={30} color={'white'} />
        <Image
          src={defaultImage}
          alt="기본이미지"
          width={45}
          height={45}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
