interface FavoriteButtonProps {
  active: boolean;
  busy?: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ active, busy, onToggle }: FavoriteButtonProps) {
  return (
    <button className={active ? 'btn danger' : 'btn'} type="button" onClick={onToggle} disabled={busy}>
      {active ? 'Remove from favorites' : 'Add to favorites'}
    </button>
  );
}
