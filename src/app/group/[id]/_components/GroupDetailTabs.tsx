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
        className={
          activeTab === 'playlists'
            ? 'text-text-primary text-md font-bold'
            : 'text-text-secondary text-md'
        }
      >
        플레이리스트
      </button>
      <span aria-hidden="true" className="bg-border mx-4 block h-4 w-px" />
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'members'}
        onClick={() => onChange('members')}
        className={
          activeTab === 'members'
            ? 'text-text-primary text-md font-bold'
            : 'text-text-secondary text-md'
        }
      >
        멤버
      </button>
    </div>
  );
}
