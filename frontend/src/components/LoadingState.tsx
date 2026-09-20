export function LoadingState({ message = 'Exploring the multiverse...' }: { message?: string }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <p>{message}</p>
      <div className="card-grid" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="skeleton" key={index} />
        ))}
      </div>
    </div>
  );
}
