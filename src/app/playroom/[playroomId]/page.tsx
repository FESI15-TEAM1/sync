import Player from './_components/Player';

export default async function page({
  params,
}: {
  params: { playroomId: number };
}) {
  const { playroomId } = await params;

  return (
    <>
      <h1>{playroomId}&#39;s playroom let&#39;s listen together~ yey!</h1>
      <Player />
    </>
  );
}
