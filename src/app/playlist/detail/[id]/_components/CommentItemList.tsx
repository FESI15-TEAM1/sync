import CommentItem from '@/app/playlist/detail/[id]/_components/CommentItem';

export interface CommentItemsType {
  items: CommentItemType[];
  nextCursor: string;
}

export interface CommentItemType {
  id: number;
  author: {
    userId: number;
    nickname: string;
    image: string;
  };
  content: string;
  createdAt: string;
}

export default function CommentItemList({
  comments,
  userid,
}: {
  comments: CommentItemsType;
  userid: string | number | null;
}) {
  //author의 유저id와 현재 유저의 아이디가 동일하면 commentitem에 owner인지 아닌지 넘겨주기
  //
  return (
    <div className="flex flex-col gap-3">
      {[...comments.items].reverse().map((item) => {
        return <CommentItem key={item.id} comment={item} userid={userid} />;
      })}
    </div>
  );
}
