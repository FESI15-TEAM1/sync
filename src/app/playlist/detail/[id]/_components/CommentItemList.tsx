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
  onEditSave,
  isSaving,
  onDeleteRequest,
  onProfileClick,
}: {
  comments: CommentItemsType;
  userid: string | null;
  onEditSave: (commentId: number, content: string) => Promise<unknown>;
  onDeleteRequest: (commentId: number) => void;
  onProfileClick: (userId: number) => void;
  isSaving: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {[...comments.items].reverse().map((item) => {
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
