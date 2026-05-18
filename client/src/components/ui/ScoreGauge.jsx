import { motion } from 'framer-motion';

const ScoreGauge = ({ score, size = 120 }) => {
  const percentage = (score / 10) * 100;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (score >= 8) return { stroke: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'text-emerald-500' };
    if (score >= 6) return { stroke: '#f59e0b', bg: 'rgba(245,158,11,0.1)', text: 'text-amber-500' };
    if (score >= 4) return { stroke: '#f97316', bg: 'rgba(249,115,22,0.1)', text: 'text-orange-500' };
    return { stroke: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: 'text-red-500' };
  };

  const getLabel = () => {
    if (score >= 9) return 'Exceptional';
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Very Good';
    if (score >= 6) return 'Good';
    if (score >= 5) return 'Average';
    if (score >= 4) return 'Below Avg';
    return 'Needs Work';
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-dark-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className={`text-2xl font-heading font-bold ${color.text}`}
          >
            {score}
          </motion.span>
          <span className="text-xs text-[var(--text-muted)]">/10</span>
        </div>
      </div>
      <p className={`mt-2 text-sm font-semibold ${color.text}`}>{getLabel()}</p>
    </div>
  );
};

export default ScoreGauge;
