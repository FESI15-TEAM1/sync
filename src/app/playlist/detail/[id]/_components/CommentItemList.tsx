import CommentItem from '@/app/playlist/detail/[id]/_components/CommentItem';

export interface CommentItemsType {
  items: CommentItemType[];
  nextCursor: string | null;
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
  items,
  userid,
  onEditSave,
  isSaving,
  onDeleteRequest,
  onProfileClick,
}: {
  items: CommentItemType[];
  userid: string | null;
  onEditSave: (commentId: number, content: string) => Promise<unknown>;
  onDeleteRequest: (commentId: number) => void;
  onProfileClick: (userId: number) => void;
  isSaving: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        return (
          <CommentItem
            key={item.id}
            comment={item}
            userid={userid}
            onEditSave={onEditSave}
            isSaving={isSaving}
            onDeleteRequest={onDeleteRequest}
            onProfileClick={onProfileClick}
          />
        );
      })}
    </div>
  );
}
