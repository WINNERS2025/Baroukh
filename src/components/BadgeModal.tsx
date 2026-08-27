import { motion, AnimatePresence } from 'framer-motion';
import type { Badge } from '@/data/badges';

interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeModal({ badge, onClose }: BadgeModalProps) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-royal-950/70 backdrop-blur-sm"
        >
          {/* Confetti */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl pointer-events-none"
              initial={{ x: '50%', y: '50%', opacity: 1, scale: 0 }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: 0,
                scale: 1.5,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.5, delay: 0.2 + Math.random() * 0.3 }}
            >
              {['🎉', '🏅', '✨', '🌟', '🎊'][i % 5]}
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-white rounded-3xl p-8 md:p-10 text-center max-w-sm mx-4 shadow-2xl border-4 border-gold-400 relative z-10"
          >
            <p className="font-display text-sm font-bold text-gold-600 mb-2">
              🏅 وسام جديد!
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 260 }}
              className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-6xl shadow-glow border-4 border-white mb-4`}
            >
              {badge.emoji}
            </motion.div>
            <h2 className="font-display text-2xl font-black text-royal-800 mb-2">
              {badge.title}
            </h2>
            <p className="text-base text-royal-600 mb-6">{badge.description}</p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-royal-300"
            >
              رائع! أكمل الرحلة ←
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
