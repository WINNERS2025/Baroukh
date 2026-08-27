import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  totalStars: number;
  maxStars: number;
  badgeCount: number;
  maxBadges: number;
}

export function ProgressBar({ completed, total, totalStars, maxStars, badgeCount, maxBadges }: ProgressBarProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <span className="font-display text-lg font-bold text-royal-900">
          رحلتك: {completed} / {total} محطات
        </span>
        <div className="flex items-center gap-3">
          <motion.div
            key={totalStars}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold-100 border-2 border-gold-300"
          >
            <Star className="w-4 h-4 fill-gold-400 text-gold-500" />
            <span className="font-display text-sm font-black text-gold-700">
              {totalStars} / {maxStars}
            </span>
          </motion.div>
          <motion.div
            key={badgeCount}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 border-2 border-violet-300"
          >
            <Award className="w-4 h-4 text-violet-600" />
            <span className="font-display text-sm font-black text-violet-700">
              {badgeCount} / {maxBadges}
            </span>
          </motion.div>
        </div>
      </div>
      <div className="h-4 w-full rounded-full bg-parchment-200 overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-gold-400 via-gold-500 to-royal-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
        </motion.div>
      </div>
    </div>
  );
}
