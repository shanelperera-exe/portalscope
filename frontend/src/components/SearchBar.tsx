interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search the multiverse',
  label = 'Search',
}: SearchBarProps) {
  return (
    <label>
      <span className="visually-hidden">{label}</span>
      <input
        className="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </label>
  );
}
