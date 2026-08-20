import PublicPlayroomList from '@/app/(main)/_components/PublicPlayroomList';
import Section from '@/app/(main)/_components/Section';
import PublicGroupList from '@/components/domain/group/PublicGroupList';

import PublicPlaylistCardList from './_components/PublicPlaylistCardList';

export default function Main() {
  return (
    <div className="flex flex-col gap-12">
      <Section headline="현재 핫한 플레이룸🔥" list={<PublicPlayroomList />} />
      <Section
        headline="새로 생긴 플레이리스트!"
        list={<PublicPlaylistCardList />}
      />
      <Section headline="최근 그룹 목록" list={<PublicGroupList />} />
    </div>
  );
}
