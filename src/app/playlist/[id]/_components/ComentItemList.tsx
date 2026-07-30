import ComentItem from './ComentItem';

export interface ComentItemsType {
  items: ComentItemType[];
  nextCursor: string;
}

export interface ComentItemType {
  id: number;
  author: {
    userId: number;
    nickname: string;
    image: string;
  };
  content: string;
  createdAt: string;
}

export default function ComentItemList({
  coments,
}: {
  coments: ComentItemsType;
}) {
  return (
    <div className="flex flex-col gap-3">
      {coments.items.map((item) => {
        return <ComentItem key={item.id} coment={item} />;
      })}
    </div>
  );
}
