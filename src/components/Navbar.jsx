import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, LibraryBig, Users, UserCircle2, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  const { unreadCount, userSettings, userPlan, PLAN_TIERS } = useLibrary();
  const { logout } = useAuth();
  const plan = PLAN_TIERS[userPlan] || PLAN_TIERS.pro;

  const navLinks = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: LibraryBig },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/profile', label: 'Profile', icon: UserCircle2 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Close avatar menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-nav">
      <div className="w-full max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8 md:gap-14">
          <Link to="/home" className="text-2xl font-bold tracking-tight shrink-0">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="gradient-text"
            >
              Alexandria
            </motion.span>
          </Link>

          <nav className="hidden lg:flex gap-1 bg-white/5 p-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-purple-400' : ''} />
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Notif + Avatar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative items-center group">
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--bg-base)] border border-white/10 rounded-full py-2.5 px-4 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all w-56 lg:w-72 placeholder-gray-500 shadow-inner group-hover:bg-white/5"
            />
            <Search className="h-4 w-4 absolute left-4 text-gray-400 group-hover:text-purple-300 transition-colors pointer-events-none" />
          </form>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(o => !o); setAvatarMenuOpen(false); }}
              className={`relative p-2.5 rounded-full border transition-all ${
                notifOpen
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 flex items-center justify-center bg-purple-500 text-white text-[10px] font-bold rounded-full px-1 shadow-lg shadow-purple-500/50 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* Avatar Menu */}
          <div className="relative shrink-0" ref={avatarRef}>
            <button
              onClick={() => { setAvatarMenuOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/40 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={userSettings.avatarUrl}
                  alt={userSettings.name}
                  className="w-9 h-9 rounded-full border border-white/20 object-cover relative z-10"
                />
                {/* Plan badge on avatar */}
                <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-black rounded-full border z-20 leading-none ${plan.badge}`}>
                  {plan.name.toUpperCase()}
                </span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform hidden md:block ${avatarMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {avatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                  className="absolute top-full right-0 mt-3 w-52 z-200 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                  style={{ background: 'rgba(8, 8, 12, 0.96)', backdropFilter: 'blur(30px)' }}
                >
                  <div className="px-4 py-3.5 border-b border-white/5">
                    <p className="text-sm font-bold text-white truncate">{userSettings.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{userSettings.email}</p>
                  </div>
                  <div className="py-1.5">
                    <Link
                      to="/profile"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <UserCircle2 size={15} className="text-gray-500" /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings size={15} className="text-gray-500" /> Settings
                    </Link>
                  </div>
                  <div className="py-1.5 border-t border-white/5">
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
