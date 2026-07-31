import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import PlaylistDetailView from '@/app/playlist/detail/[id]/_components/PlaylistDetailView';

const data = {
  tracks: [
    {
      id: 10,
      videoId: 'oZpYEEcvu5I',
      title: 'tuki.『만찬가』Official Music Video',
      artist: 'tuki.(17)',
      thumbnail:
        'https://i.ytimg.com/vi/oZpYEEcvu5I/hq720.jpg?sqp=-oaymwEqCNAFEJQDSFryq4qpAxwIARUAAIhCGAHYAQHiAQoIGBACGAY4AUABuAIZovOX_wMOCKfinqwGGODqBCDgqAE=&rs=AOn4CLBkr1n5P4qrGeenHafIq1xQQ9pNfQ&usqp=CBk',
    },
    {
      id: 11,
      videoId: 'OaPBaP-yyNk',
      title: '【Ado】逆光（ウタ from ONE PIECE FILM RED）',
      artist: 'Ado',
      thumbnail:
        'https://i.ytimg.com/vi/gt-v_YCkaMY/hqdefault.jpg?sqp=-oaymwEpCKgBEF5IWvKriqkDHAgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAG4Ahmi85f_Aw4ImvvInwYY4OoEIOCoAQ==&rs=AOn4CLAI4I1QR6Fo8wMhU_Cx3KTIDZzG2g&usqp=CBk',
    },
    {
      id: 12,
      videoId: 'sk1Z-Hqwwog',
      title: '【Ado】私は最強 (ウタ from ONE PIECE FILM RED)',
      artist: 'Ado',
      thumbnail:
        'https://i.ytimg.com/vi/sk1Z-Hqwwog/hqdefault.jpg?sqp=-oaymwEpCKgBEF5IWvKriqkDHAgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAG4Ahmi85f_Aw4I0fvInwYY4OoEIOCoAQ==&rs=AOn4CLBc6BqJzNIe-EN2Y3GjpfsAlC6uOA&usqp=CBk',
    },
    {
      id: 13,
      videoId: 'n6WaTObHRJM',
      title:
        '2019 신 애국가 1~4절 영상ㅣ2019 New version National Anthem of Koreaㅣlmlxiabeize',
      artist: '에레멜lmlxiabeize',
      thumbnail:
        'https://i.ytimg.com/vi/n6WaTObHRJM/hq720.jpg?sqp=-oaymwEqCNAFEJQDSFryq4qpAxwIARUAAIhCGAHYAQHiAQoIGBACGAY4AUABuAIZovOX_wMOCJWwr-EFGODqBCDgqAE=&rs=AOn4CLCTExm3zUnMqcm10jvDxPqff0RAMw&usqp=CBk',
    },
  ],
};
const item: CommentItemsType = {
  items: [
    {
      id: 1,
      author: {
        userId: 2,
        nickname: '아냐포져',
        image:
          'https://i.ytimg.com/vi/Cb0JZhdmjtg/hqdefault.jpg?sqp=-oaymwEpCKgBEF5IWvKriqkDHAgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAG4Ahmi85f_Aw4I4uPlxQYY4OoEIOCoAQ==&rs=AOn4CLBenVZwj1G1dI2vceu0B-00jHHxRQ&usqp=CBk',
      },
      content: 'jpop의 신 아냐포져..',
      createdAt: '2026-07-20T11:32:00Z',
    },
    {
      id: 2,
      author: {
        userId: 5,
        nickname: '명한',
        image:
          'https://i.ytimg.com/vi/Cb0JZhdmjtg/hqdefault.jpg?sqp=-oaymwEpCKgBEF5IWvKriqkDHAgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAG4Ahmi85f_Aw4I4uPlxQYY4OoEIOCoAQ==&rs=AOn4CLBenVZwj1G1dI2vceu0B-00jHHxRQ&usqp=CBk',
      },
      content: 'jpop의 신 아냐포져.. 받듭니다..',
      createdAt: '2026-07-20T11:32:00Z',
    },
  ],
  nextCursor: 'MjA',
};

export default function PlaylistDeatilPage() {
  return (
    <div className="flex justify-center p-6">
      <PlaylistDetailView tracks={data.tracks} comments={item} />
    </div>
  );
}
