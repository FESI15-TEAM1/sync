import Badge from './Badge';
// import UserIcon from './UserIcon';

export default function ListItem({
  title,
  description,
  genres,
  userCount,
  owner,
}: {
  title: string;
  description: string;
  genres: string[];
  userCount: number;
  owner: string;
}) {
  return (
    <li className="bg-bg-card hover:border-border flex cursor-pointer flex-col gap-0.5 rounded-lg border-1 border-transparent p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <Badge type="live" />

        <span className="flex items-center gap-1 text-xs text-white">
          <span className="relative flex">
            <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-red-400"></span>
            <span className="size-1 rounded-full bg-red-500"></span>
          </span>
          {userCount}명 청취 중
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-text-secondary text-xs">{description}</p>
      </div>

      <div className="mt-1 flex items-end justify-between">
        <ul className="flex flex-wrap gap-1">
          {genres.map((genre, index) => (
            <li key={index}>
              <Badge type="genre">{genre}</Badge>
            </li>
          ))}
        </ul>

        {/* <div className="flex items-end -space-x-3">
          {Array.from({ length: userCount > 5 ? 5 : userCount }).map(
            (_, index) => (
              // 첫번째 인자가 undefined여서 _로 처리
              <UserIcon key={index} length={userCount} index={index} />
            ),
          )}
        </div> */}

        <span className="text-text-secondary text-sm">{owner}님의 라이브</span>
      </div>
    </li>
  );
}
