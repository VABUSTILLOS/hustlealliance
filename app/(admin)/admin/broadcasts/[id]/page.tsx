import BroadcastComposer from '../BroadcastComposer';

export default async function EditBroadcastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Broadcast</h1>
      <BroadcastComposer broadcastId={id} />
    </div>
  );
}
