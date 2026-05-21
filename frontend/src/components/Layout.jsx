import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CreditCard,
  FileBarChart,
  GraduationCap,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  ClipboardCheck,
  Sun,
  UserRound,
  UsersRound
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: UsersRound },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/fees', label: 'Fees', icon: CreditCard },
  { path: '/results', label: 'Results', icon: GraduationCap },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/departments', label: 'Departments', icon: Building2 },
  { path: '/faculty', label: 'Faculty', icon: UserRound },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: UserRound },
  { path: '/security', label: 'Security', icon: ShieldCheck },
  { path: '/settings', label: 'Settings', icon: Settings }
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
          <span className="brand-mark">
            <img src="/assets/studenthub-logo.png" alt="StudentHub logo" />
          </span>
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
          <ChevronLeft size={18} />
        </button>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
            );
          })}
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
              <Search size={17} />
              <input placeholder="Search students, courses..." />
            </label>
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle color mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" className="icon-button notification-button" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <button type="button" className="profile-chip" onClick={() => navigate('/profile')}>
              <span>{user?.name?.slice(0, 2).toUpperCase() || 'AD'}</span>
              <strong>{user?.name || 'Admin'}</strong>
            </button>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
