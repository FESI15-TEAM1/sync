import { clsx } from 'clsx';

export type DetailTab = 'playlists' | 'members';

type GroupDetailTabsProps = {
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
};

export default function GroupDetailTabs({
  activeTab,
  onChange,
}: GroupDetailTabsProps) {
  return (
    <div
      role="tablist"
      className="mx-auto flex w-full max-w-md items-center justify-center gap-8 px-5"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'playlists'}
        onClick={() => onChange('playlists')}
        className={clsx(
          'text-md w-1/2',
          activeTab === 'playlists'
            ? 'text-text-primary font-bold'
            : 'text-text-secondary',
        )}
      >
        플레이리스트
      </button>
      <span aria-hidden="true" className="bg-border mx-4 block h-4 w-px" />
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'members'}
        onClick={() => onChange('members')}
        className={clsx(
          'text-md w-1/2',
          activeTab === 'members'
            ? 'text-text-primary font-bold'
            : 'text-text-secondary',
        )}
      >
        멤버
      </button>
    </div>
  );
}
