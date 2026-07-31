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
}: {
  comments: CommentItemsType;
}) {
  return (
    <div className="flex flex-col gap-3">
      {comments.items.map((item) => {
        return <CommentItem key={item.id} comment={item} />;
      })}
    </div>
  );
}
