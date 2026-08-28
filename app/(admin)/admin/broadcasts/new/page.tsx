import BroadcastComposer from '../BroadcastComposer';

export default function NewBroadcastPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">New broadcast</h1>
      <BroadcastComposer />
    </div>
  );
}
