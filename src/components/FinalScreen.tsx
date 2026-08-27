import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RotateCcw, Map, Star, Award, Trophy } from 'lucide-react';
import { stations } from '@/data/stations';
import { finalMessages } from '@/data/questions';

interface FinalScreenProps {
  totalStars: number;
  maxStars: number;
  badgeCount: number;
  maxBadges: number;
  onReset: () => void;
  onMap: () => void;
}

export function FinalScreen({ totalStars, maxStars, badgeCount, maxBadges, onReset, onMap }: FinalScreenProps) {
  const [revealed, setRevealed] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    finalMessages.forEach((_, i) => {
      timers.push(window.setTimeout(() => setRevealed(i + 1), 1500 + i * 800));
    });
    timers.push(window.setTimeout(() => setShowCertificate(true), 1500 + finalMessages.length * 800 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gold-200 via-parchment-100 to-royal-100 flex items-center justify-center p-4"
    >
      {/* Confetti */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          initial={{ x: '50%', y: '0%', opacity: 1, rotate: 0 }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
        >
          {['🎉', '⭐', '✨', '🌟', '💫', '🎊'][i % 6]}
        </motion.div>
      ))}

      <div className="relative max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl md:text-5xl font-black text-royal-900 mb-2 text-shadow-soft"
        >
          مبروك يا بطل!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-xl text-royal-700 mb-4"
        >
          لقد أنهيت رحلة سفر باروخ!
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 shadow-md border-2 border-gold-300">
            <Star className="w-6 h-6 fill-gold-400 text-gold-500" />
            <span className="font-display text-lg font-black text-gold-700">
              {totalStars} / {maxStars}
            </span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 shadow-md border-2 border-violet-300">
            <Award className="w-6 h-6 text-violet-600" />
            <span className="font-display text-lg font-black text-violet-700">
              {badgeCount} / {maxBadges}
            </span>
          </div>
        </motion.div>

        {/* All stations completed */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {stations.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-xl border-2 border-white shadow-md`}>
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final messages revealed one by one */}
        <div className="space-y-3 mb-6">
          {finalMessages.map((msg, i) => (
            <AnimatePresence key={i}>
              {revealed > i && (
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-md border-2 border-gold-300"
                >
                  <span className="text-xl">{['❤️', '🙏', '🧠', '🌅', '🚫'][i]}</span>
                  <span className="font-display text-lg font-bold text-royal-800">{msg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Certificate */}
        <AnimatePresence>
          {showCertificate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18 }}
              className="bg-gradient-to-b from-parchment-50 to-parchment-200 rounded-3xl p-8 shadow-2xl border-4 border-gold-500 mb-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-l from-gold-400 via-royal-500 to-gold-400" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-l from-gold-400 via-royal-500 to-gold-400" />

              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-3"
              >
                <Trophy className="w-16 h-16 text-gold-500 mx-auto" />
              </motion.div>
              <h2 className="font-display text-2xl font-black text-royal-900 mb-3">
                🏆 بطل رحلة باروخ
              </h2>
              <div className="space-y-1 text-base text-royal-700 leading-relaxed mb-4">
                <p>لقد أكملت رحلة سفر باروخ</p>
                <p>واكتشفت الرسالة،</p>
                <p>والتوبة،</p>
                <p>والصلاة،</p>
                <p>والحكمة،</p>
                <p>والرجاء،</p>
                <p>ومجد أورشليم،</p>
                <p>وخطر عبادة الأصنام.</p>
              </div>

              <div className="space-y-2 pt-4 border-t-2 border-gold-300">
                {finalMessages.map((msg, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="font-display text-base font-bold text-royal-800"
                  >
                    {['❤️', '🙏', '🧠', '🌅', '🚫'][i]} {msg}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showCertificate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-royal-300"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة الرحلة
            </button>
            <button
              onClick={onMap}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-royal-700 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-royal-300 focus:outline-none focus:ring-4 focus:ring-royal-200"
            >
              <Map className="w-5 h-5" />
              العودة إلى الخريطة
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
