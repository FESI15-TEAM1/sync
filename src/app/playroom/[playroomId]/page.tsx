import Playroom from './_components/Playroom';

export default async function Page({
  params,
}: {
  params: Promise<{ playroomId: string }>;
}) {
  const { playroomId } = await params;

  return <Playroom playroomId={Number(playroomId)} />;
}
