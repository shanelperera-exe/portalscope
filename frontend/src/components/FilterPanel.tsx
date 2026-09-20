interface FilterPanelProps {
  status: string;
  species: string;
  gender: string;
  onStatus: (value: string) => void;
  onSpecies: (value: string) => void;
  onGender: (value: string) => void;
}

export function FilterPanel({
  status,
  species,
  gender,
  onStatus,
  onSpecies,
  onGender,
}: FilterPanelProps) {
  return (
    <div className="toolbar" role="group" aria-label="Character filters">
      <select className="select" value={status} onChange={(event) => onStatus(event.target.value)} aria-label="Status">
        <option value="">All statuses</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
      <select className="select" value={species} onChange={(event) => onSpecies(event.target.value)} aria-label="Species">
        <option value="">All species</option>
        <option value="Human">Human</option>
        <option value="Alien">Alien</option>
        <option value="Humanoid">Humanoid</option>
        <option value="Robot">Robot</option>
        <option value="Mythological Creature">Mythological Creature</option>
      </select>
      <select className="select" value={gender} onChange={(event) => onGender(event.target.value)} aria-label="Gender">
        <option value="">All genders</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  );
}
