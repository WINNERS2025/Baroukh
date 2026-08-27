import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EasterEggModalProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function EasterEggModal({ open, onClose, onReset }: EasterEggModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 100));
    timers.push(window.setTimeout(() => setStep(2), 2500));
    timers.push(window.setTimeout(() => setStep(3), 5000));
    return () => timers.forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-royal-950/80 backdrop-blur-md p-4"
        >
          {/* Floating sparkles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl pointer-events-none"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: [0, -30, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            >
              ✨
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
            className="bg-gradient-to-b from-royal-900 to-royal-950 rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl border-4 border-gold-400 relative z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>

            <AnimatePresence mode="wait">
              {step >= 1 && step < 2 && (
                <motion.p
                  key="s1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="font-display text-2xl font-bold text-white mb-4"
                >
                  أنت خلصت رحلة باروخ...
                </motion.p>
              )}
              {step >= 2 && step < 3 && (
                <motion.p
                  key="s2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="font-display text-2xl font-bold text-gold-300 mb-4"
                >
                  لكن رحلتك مع ربنا لسه بتبدأ ❤️
                </motion.p>
              )}
              {step >= 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-display text-2xl font-bold text-white mb-6">
                    جاهز تبدأ رحلة جديدة؟ 🚀
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        onReset();
                        onClose();
                      }}
                      className="px-8 py-3 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
                    >
                      ابدأ من جديد
                    </button>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 rounded-full bg-white/10 text-white font-bold text-lg shadow-md hover:bg-white/20 active:scale-95 transition-all border-2 border-white/30 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      لا، شكرًا
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
