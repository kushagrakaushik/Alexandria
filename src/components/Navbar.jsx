import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userProfile } from '../data/mockData';
import { Search, Home, LibraryBig, Users, UserCircle2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-nav">
      <div className="w-full max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="gradient-text"
            >
              BookVerse
            </motion.span>
          </Link>
          
          <nav className="hidden lg:flex gap-2 bg-white/5 p-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-purple-400' : ''} />
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="hidden md:flex relative items-center group">
            <input 
              type="text" 
              placeholder="Search books, authors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--bg-base)] border border-white/10 rounded-full py-2.5 px-4 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all w-64 lg:w-80 placeholder-gray-500 shadow-inner group-hover:bg-white/5"
            />
            <Search className="h-4 w-4 absolute left-4 text-gray-400 group-hover:text-purple-300 transition-colors pointer-events-none" />
          </form>

          <Link to="/profile" className="shrink-0 relative group">
            <div className="absolute inset-0 bg-purple-500/50 rounded-full blur group-hover:blur-md transition-all opacity-0 group-hover:opacity-100" />
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              className="w-10 h-10 rounded-full border border-white/20 object-cover relative z-10"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
