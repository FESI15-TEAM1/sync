import BackButton from '@/components/common/BackButton';

export default function PlayroomHeader({
  playroomTitle,
}: {
  playroomTitle: string;
}) {
  return (
    <div className="mx-2 my-4 flex items-center justify-between">
      <BackButton />
      <h1 className="text-text-primary text-base">{playroomTitle}</h1>
      <span className="w-6"></span>
    </div>
  );
}
