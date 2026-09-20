export function EmptyState({ message }: { message: string }) {
  return (
    <div className="state">
      <p>{message}</p>
    </div>
  );
}
