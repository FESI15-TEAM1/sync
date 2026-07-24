import Stream from './playroom';

export default async function page({
  params,
}: {
  params: { playroomId: number };
}) {
  const { playroomId } = await params;

  return (
    <>
      <Stream playroomId={playroomId} />
    </>
  );
}
