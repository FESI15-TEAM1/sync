import EditPage from './_components/EditPage';

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditPage groupId={id} />;
}
