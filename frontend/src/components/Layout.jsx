import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'DB' },
  { path: '/students', label: 'Students', icon: 'ST' },
  { path: '/courses', label: 'Courses', icon: 'CR' },
  { path: '/departments', label: 'Departments', icon: 'DP' },
  { path: '/analytics', label: 'Analytics', icon: 'AN' },
  { path: '/profile', label: 'Profile', icon: 'PR' },
  { path: '/settings', label: 'Settings', icon: 'SE' }
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('studenthub_theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('studenthub_theme', theme);
  }, [theme]);

  const currentPage = navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SH</span>
          <div>
            <strong>StudentHub</strong>
            <small>Student Information</small>
          </div>
        </div>
        <button
          type="button"
          className="icon-button sidebar-toggle"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <small>Institution Plan</small>
          <strong>Campus Pro</strong>
          <span>94% records verified</span>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <p>{currentPage}</p>
            <strong>Welcome back, {user?.name || 'Admin'}</strong>
          </div>
          <div className="topbar-actions">
            <label className="search-shell" aria-label="Search StudentHub">
              <span>Search</span>
              <input placeholder="Search students, courses..." />
            </label>
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle color mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'LT' : 'DK'}
            </button>
            <button type="button" className="icon-button notification-button" aria-label="Notifications">
              NT
              <i />
            </button>
            <button type="button" className="profile-chip" onClick={() => navigate('/profile')}>
              <span>{user?.name?.slice(0, 2).toUpperCase() || 'AD'}</span>
              <strong>{user?.name || 'Admin'}</strong>
            </button>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
