import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-secondary-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
    <p className="mt-4 text-[var(--text-muted)] animate-pulse">{text}</p>
  </div>
);

const SkeletonCard = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full mb-2"></div>
    <div className="h-3 bg-[var(--bg-tertiary)] rounded w-5/6 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-6 bg-[var(--bg-tertiary)] rounded-full w-16"></div>
      <div className="h-6 bg-[var(--bg-tertiary)] rounded-full w-20"></div>
    </div>
  </div>
);

const AILoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="relative w-24 h-24 mb-6">
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-primary-400"
      />
      {/* Middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-3 rounded-full border-2 border-dashed border-secondary-400"
      />
      {/* Inner circle */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
      >
        <span className="text-white text-lg">🧠</span>
      </motion.div>
      {/* Orbiting dots */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-400" />
        </motion.div>
      ))}
    </div>
    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-lg font-heading font-semibold gradient-text"
    >
      AI is analyzing your startup...
    </motion.p>
    <p className="text-sm text-[var(--text-muted)] mt-2">This may take a moment</p>
  </motion.div>
);

export { Loader, SkeletonCard, AILoader };
export default Loader;
