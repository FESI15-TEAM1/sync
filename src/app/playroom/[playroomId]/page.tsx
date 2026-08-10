import { notFound } from 'next/navigation';

import Playroom from './_components/Playroom';

export default async function Page({
  params,
}: {
  params: Promise<{ playroomId: string }>;
}) {
  const { playroomId } = await params;

  const parsedPlayroomId = Number(playroomId);
  if (!Number.isSafeInteger(parsedPlayroomId) || parsedPlayroomId <= 0) {
    notFound();
  }

  return <Playroom playroomId={parsedPlayroomId} />;
}
