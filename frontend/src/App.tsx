import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { CharacterDetailsPage } from './pages/CharacterDetails';
import { CharactersPage } from './pages/Characters';
import { EpisodeDetailsPage } from './pages/EpisodeDetails';
import { EpisodesPage } from './pages/Episodes';
import { FavoritesPage } from './pages/Favorites';
import { HomePage } from './pages/Home';
import { LocationDetailsPage } from './pages/LocationDetails';
import { LocationsPage } from './pages/Locations';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:id" element={<CharacterDetailsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:id" element={<LocationDetailsPage />} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/episodes/:id" element={<EpisodeDetailsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
