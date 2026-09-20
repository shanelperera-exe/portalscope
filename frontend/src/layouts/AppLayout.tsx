import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">PortalScope Harbor workload · Interdimensional Explorer 1.0.0</footer>
    </div>
  );
}
