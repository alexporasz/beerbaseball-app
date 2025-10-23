import { NavLink, Route, Routes } from 'react-router-dom';
import Display from './routes/Display.jsx';
import Input from './routes/Input.jsx';
import './styles/layout.css';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="top-nav" aria-label="Primary">
          <NavLink to="/display" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Display
          </NavLink>
          <NavLink to="/input" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Input
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/display" element={<Display />} />
          <Route path="/input" element={<Input />} />
          <Route path="*" element={<Display />} />
        </Routes>
      </main>
    </div>
  );
}
