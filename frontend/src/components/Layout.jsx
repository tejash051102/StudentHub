import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/students', label: 'Students' },
  { path: '/courses', label: 'Courses' },
  { path: '/profile', label: 'Profile' }
];

export default function Layout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SR</span>
          <div>
            <strong>Student Records</strong>
            <small>Management System</small>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <p>Welcome back</p>
            <strong>{user?.name}</strong>
          </div>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
