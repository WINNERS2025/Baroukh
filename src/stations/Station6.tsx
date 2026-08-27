import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station6Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'sunrise' | 'message' | 'game' | 'reward';
  presenterMode?: boolean;
}

export function Station6({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station6Props) {
  const [phase, setPhase] = useState<'intro' | 'sunrise' | 'message' | 'game' | 'reward'>(startPhase);
  const [sunStage, setSunStage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // In presenter mode, auto-play the sunrise animation when entering at 'sunrise'
  useEffect(() => {
    if (presenterMode && startPhase === 'sunrise') {
      const stages = [1, 2, 3];
      const timers = stages.map((s, i) => setTimeout(() => setSunStage(s), (i + 1) * 900));
      return () => timers.forEach(clearTimeout);
    }
  }, [presenterMode, startPhase]);

  const startSunrise = () => {
    setPhase('sunrise');
    setSunStage(0);
    const stages = [1, 2, 3];
    stages.forEach((s, i) => {
      setTimeout(() => setSunStage(s), (i + 1) * 900);
    });
    if (!presenterMode) {
      setTimeout(() => setPhase('message'), 3600);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="text-8xl">🌑</div>
        </motion.div>
        <p className="text-lg text-royal-700">
          هل انتهت الحكاية بالحزن؟
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); startSunrise(); }}
              className="px-8 py-3 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
            >
              اكتشف النهاية ✨
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'sunrise') {
    const sun = ['🌑', '🌅', '☀️', '👑'][sunStage];
    return (
      <motion.div
        animate={{ backgroundColor: ['#141b57', '#192db6', '#fbbf24', '#8eb5ff'][sunStage] }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-white p-8 relative overflow-hidden"
      >
        {/* Stars appear in darkness */}
        {sunStage === 0 &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() }}
            >
              ⭐
            </motion.div>
          ))}

        <motion.div
          key={sunStage}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-9xl mb-4 relative z-10"
        >
          {sun}
        </motion.div>
        <p className="font-display text-2xl font-bold text-center relative z-10">
          {['مدينة مظلمة', 'شروق...', 'نور!', 'مجد أورشليم'][sunStage]}
        </p>

        {presenterMode && sunStage === 3 && (
          <div className="mt-6 relative z-10">
            <button
              onClick={() => { play('click'); setPhase('message'); }}
              className="px-6 py-2 rounded-full bg-white/30 backdrop-blur-sm text-white font-bold border border-white/40 hover:bg-white/40 active:scale-95 transition-all"
            >
              متابعة ✨
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  if (phase === 'message') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl mb-4"
        >
          👑
        </motion.div>
        <GameCard>
          <p className="font-display text-2xl font-bold text-gold-700 mb-2">
            مجد أورشليم
          </p>
          <p className="text-lg text-royal-700 leading-relaxed">
            باروخ ينتقل من الحزن إلى الرجاء.
            يتكلم عن مجد أورشليم وفرح رجوع أبنائها.
          </p>
          <button
            onClick={() => setPhase('game')}
            className={`mt-6 px-8 py-3 rounded-full bg-gold-500 text-royal-900 font-bold text-lg shadow-lg hover:bg-gold-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300 ${presenterMode ? 'hidden' : ''}`}
          >
            العب: قبل وبعد 🔄
          </button>
        </GameCard>
      </div>
    );
  }

  if (phase === 'game') {
    const options = [
      { emoji: '😢', text: 'مدينة حزينة', correct: false },
      { emoji: '😊', text: 'مدينة مضيئة', correct: true },
    ];
    return (
      <div className="max-w-2xl mx-auto">
        <GameCard>
          <p className="font-display text-xl font-bold text-gold-700 text-center mb-2">
            قبل وبعد
          </p>
          <p className="text-base text-royal-600 text-center mb-4">
            أي صورة تعبر عن الرجاء؟
          </p>
          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, idx) => {
              let cls = 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100';
              if (selected !== null) {
                if (opt.correct) cls = 'border-sage-500 bg-sage-100';
                else if (idx === selected) cls = 'border-clay-500 bg-clay-100';
                else cls = 'border-parchment-200 bg-parchment-50 opacity-60';
              }
              return (
                <motion.button
                  key={idx}
                  onClick={() => {
                    if (selected !== null) return;
                    setSelected(idx);
                    if (opt.correct) {
                      play('correct');
                      play('complete');
                      setTimeout(() => setPhase('reward'), 1000);
                    } else {
                      setWrongAttempts((a) => a + 1);
                      play('wrong');
                      setTimeout(() => setSelected(null), 1200);
                    }
                  }}
                  disabled={selected !== null}
                  animate={selected === idx && !opt.correct ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`rounded-2xl border-4 p-6 transition-all min-h-[120px] ${cls} ${
                    selected === null ? 'hover:scale-[1.02] active:scale-95' : ''
                  } focus:outline-none focus:ring-4 focus:ring-gold-300`}
                >
                  <div className="text-6xl mb-2 flex justify-center">{opt.emoji}</div>
                  <p className="font-bold text-royal-800 text-center">{opt.text}</p>
                </motion.button>
              );
            })}
          </div>
        </GameCard>
      </div>
    );
  }

  const stars = wrongAttempts === 0 ? 3 : 2;
  return (
    <StarReward
      stars={stars}
      message="🎉 أحسنت!"
      subtitle="مجد أورشليم هو فرح رجوع أبنائها."
      onComplete={() => onComplete(stars)}
    />
  );
}
