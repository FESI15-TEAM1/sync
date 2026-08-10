import type { MemberType } from './MemberItem';
import MemberItem from './MemberItem';

export default function Members({ members }: { members: MemberType[] }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 p-4">
        {members.map((member, idx) => (
          <MemberItem
            userId={member.userId}
            username={member.username}
            userImage={member.userImage}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}
