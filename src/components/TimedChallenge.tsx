import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface TimedChallengeProps {
  title: string;
  duration: number;
  onComplete: () => void;
  onTimeout: () => void;
  children: React.ReactNode;
}

export function TimedChallenge({ title, duration, onComplete, onTimeout, children }: TimedChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      setActive(false);
      onTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, active, onTimeout]);

  const pct = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.div
          animate={isUrgent ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold shadow-md ${
            isUrgent
              ? 'bg-clay-500 text-white'
              : timeLeft < duration * 0.5
              ? 'bg-gold-400 text-royal-900'
              : 'bg-sage-500 text-white'
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="font-display text-lg font-black tabular-nums">
            {timeLeft}
          </span>
          <span className="text-sm">ثانية</span>
        </motion.div>
      </div>

      <div className="h-2 w-full rounded-full bg-parchment-200 overflow-hidden mb-4">
        <motion.div
          className={`h-full rounded-full ${isUrgent ? 'bg-clay-500' : 'bg-sage-500'}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <p className="font-display text-lg font-bold text-royal-700 text-center mb-4">
        ⏱️ {title}
      </p>

      {children}
    </div>
  );
}

export function TimedOutMessage({ onRetry, onSkip }: { onRetry: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl border-4 border-gold-400"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl mb-4"
        >
          ⏰
        </motion.div>
        <p className="font-display text-2xl font-bold text-royal-800 mb-2">
          انتهى الوقت!
        </p>
        <p className="text-lg text-royal-600 mb-6">
          ولا يهمك! جرّب مرة تانية. ❤️
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-royal-300"
          >
            جرّب مرة تانية
          </button>
          <button
            onClick={onSkip}
            className="px-6 py-3 rounded-full bg-parchment-200 text-royal-700 font-bold shadow-md hover:bg-parchment-300 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-parchment-400"
          >
            متابعة بدون نجمة
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
