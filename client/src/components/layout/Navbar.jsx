import { useLocation } from 'react-router-dom';
import { HiMenu, HiMoon, HiSun, HiSearch } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/ideas': 'My Ideas',
  '/ideas/new': 'New Idea',
  '/reports': 'Reports',
  '/profile': 'Profile',
};

const Navbar = ({ onMenuClick, collapsed }) => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes('/ideas/') && location.pathname.includes('/edit')) return 'Edit Idea';
    if (location.pathname.includes('/ideas/') && location.pathname.includes('/analyze')) return 'AI Analysis';
    if (location.pathname.includes('/ideas/') && location.pathname !== '/ideas/new') return 'Idea Details';
    if (location.pathname.includes('/reports/') && location.pathname !== '/reports') return 'Report Details';
    return pageTitles[location.pathname] || 'StartupIQ AI';
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-lg">{getTitle()}</h2>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-primary-100 dark:hover:bg-dark-700 transition-colors"
          >
            {darkMode ? (
              <HiSun className="w-5 h-5 text-amber-400" />
            ) : (
              <HiMoon className="w-5 h-5 text-primary-500" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
