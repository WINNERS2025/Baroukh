import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRewardProps {
  stars: number;
  message: string;
  subtitle?: string;
  onComplete: () => void;
}

export function StarReward({ stars, message, subtitle, onComplete }: StarRewardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/60 backdrop-blur-sm"
    >
      {/* Star burst particles */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const distance = 120 + Math.random() * 80;
        return (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 1.5,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1.2, delay: 0.3 + Math.random() * 0.2 }}
          >
            {['⭐', '✨', '🌟'][i % 3]}
          </motion.div>
        );
      })}

      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md mx-4 shadow-2xl border-4 border-gold-400 relative z-10"
      >
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="font-display text-3xl font-black text-royal-800 mb-2"
        >
          {message}
        </motion.p>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-royal-600 mb-4"
          >
            {subtitle}
          </motion.p>
        )}

        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180, y: -60 }}
              animate={{
                scale: i < stars ? 1 : 0.6,
                rotate: 0,
                y: 0,
              }}
              transition={{ delay: 0.4 + i * 0.2, type: 'spring', stiffness: 200 }}
            >
              <Star
                className={`w-16 h-16 drop-shadow-lg ${
                  i < stars
                    ? 'fill-gold-400 text-gold-500'
                    : 'fill-parchment-200 text-parchment-300'
                }`}
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onComplete}
          className="px-8 py-3 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-royal-300"
        >
          متابعة الرحلة
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
