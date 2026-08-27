import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

interface RewardAnimationProps {
  stars: number;
  message: string;
  onComplete: () => void;
}

export function RewardAnimation({ stars, message, onComplete }: RewardAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md mx-4 shadow-2xl border-4 border-gold-400"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
          className="inline-block mb-4"
        >
          <CheckCircle2 className="w-20 h-20 text-sage-500 fill-sage-100" strokeWidth={2.5} />
        </motion.div>

        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: stars }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180, y: -40 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
            >
              <Star className="w-12 h-12 fill-gold-400 text-gold-500 drop-shadow-lg" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-display text-2xl font-bold text-royal-800 mb-6"
        >
          {message}
        </motion.p>

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

      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: '50%',
            y: '50%',
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            opacity: 0,
            scale: 1.5,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.5, delay: 0.2 + Math.random() * 0.3 }}
        >
          {['🎉', '⭐', '✨', '🌟', '💫'][i % 5]}
        </motion.div>
      ))}
    </motion.div>
  );
}
