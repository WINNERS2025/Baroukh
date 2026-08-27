import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface XPDisplayProps {
  totalStars: number;
  stationStars: Record<number, number>;
  presentationMode?: boolean;
}

export function computeXP(stationStars: Record<number, number>): number {
  let xp = 0;
  for (const id of [1, 2, 3, 4, 5, 6, 7]) {
    const stars = stationStars[id] ?? 0;
    xp += stars * 10;
  }
  return xp;
}

const LEVEL_THRESHOLDS = [0, 10, 30, 60, 100, 140, 180];
const MAX_LEVEL = 6;

const LEVEL_TITLES = [
  'بداية الرحلة',
  'مسافر',
  'مستكشف',
  'باحث',
  'حكيم',
  'مرشد',
  'أستاذ الرحلة',
];

export function computeLevel(xp: number): number {
  for (let i = MAX_LEVEL; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

function levelProgress(xp: number, level: number): number {
  if (level >= MAX_LEVEL) return 1;
  const current = LEVEL_THRESHOLDS[level];
  const next = LEVEL_THRESHOLDS[level + 1];
  return Math.min((xp - current) / (next - current), 1);
}

export function XPDisplay({ totalStars, stationStars, presentationMode }: XPDisplayProps) {
  const xp = computeXP(stationStars);
  const level = computeLevel(xp);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [levelUpPopup, setLevelUpPopup] = useState<number | null>(null);
  const progressFrac = levelProgress(xp, level);
  const prevXpRef = useRef(xp);
  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const gained = xp - prevXpRef.current;
      setXpPopup(gained);
      const timer = setTimeout(() => setXpPopup(null), 2500);
      prevXpRef.current = xp;
      return () => clearTimeout(timer);
    }
    prevXpRef.current = xp;
  }, [xp]);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setLevelUpPopup(level);
      const timer = setTimeout(() => setLevelUpPopup(null), 3000);
      prevLevelRef.current = level;
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = level;
  }, [level]);

  return (
    <>
      {/* Persistent XP/Level badge — elegant, compact */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className={`flex items-center gap-2 ${presentationMode ? 'scale-125' : ''}`}
      >
        {/* Level badge with circular progress ring */}
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 shadow-md border border-gold-200">
          {/* Level circle */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="#f3e9c8" strokeWidth="3" />
              <motion.circle
                cx="16" cy="16" r="13" fill="none"
                stroke="#cdaa4e" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 13}
                animate={{ strokeDashoffset: 2 * Math.PI * 13 * (1 - progressFrac) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[11px] font-black text-royal-800">{level}</span>
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[10px] font-bold text-gold-600">{LEVEL_TITLES[level]}</span>
            <span className="font-display text-xs font-black text-royal-800">{xp} XP</span>
          </div>
        </div>
      </motion.div>

      {/* XP gain popup — elegant, slides up */}
      <AnimatePresence>
        {xpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-xl border border-gold-200">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-display text-xl font-black text-royal-800">
                +{xpPopup} XP
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up popup — celebratory but elegant */}
      <AnimatePresence>
        {levelUpPopup !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[71] pointer-events-none"
          >
            <div className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl bg-gradient-to-b from-white to-gold-50 shadow-2xl border-2 border-gold-300">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-3xl"
              >
                🎉
              </motion.div>
              <p className="font-display text-lg font-black text-royal-800">
                مستوى {levelUpPopup}
              </p>
              <p className="font-display text-sm font-bold text-gold-600">
                {LEVEL_TITLES[levelUpPopup]}
              </p>
            </div>
            {/* Sparkles around level-up */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-base"
                style={{ left: '50%', top: '50%' }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 80,
                  y: Math.sin((i / 8) * Math.PI * 2) * 80,
                  scale: [0, 1.2, 0],
                }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
