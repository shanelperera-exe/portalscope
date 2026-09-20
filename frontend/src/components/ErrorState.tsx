export function ErrorState({
  message = "Oops! The portal is unstable. We couldn't retrieve the data right now.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="state" role="alert">
      <p>{message}</p>
      <button className="btn" type="button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
