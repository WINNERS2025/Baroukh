import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station4Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'paths' | 'chest' | 'puzzle' | 'reward';
  presenterMode?: boolean;
}

const paths = [
  { id: 'money', emoji: '💰', label: 'المال', correct: false },
  { id: 'fame', emoji: '🏆', label: 'الشهرة', correct: false },
  { id: 'wisdom', emoji: '🧠', label: 'حكمة الله', correct: true },
];

const puzzleOptions = [
  { emoji: '😤', text: 'في الغرور', correct: false },
  { emoji: '💰', text: 'في المال فقط', correct: false },
  { emoji: '✨', text: 'عند الله', correct: true },
];

export function Station4({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station4Props) {
  const [phase, setPhase] = useState<'intro' | 'paths' | 'chest' | 'puzzle' | 'reward'>(startPhase);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [puzzleSelected, setPuzzleSelected] = useState<number | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl"
          >
            🧠
          </motion.div>
        </motion.div>
        <p className="text-lg text-royal-700">
          لو عندك كنز... هتختار دهب ولا حكمة؟
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); setPhase('paths'); }}
              className="px-8 py-3 rounded-full bg-violet-500 text-white font-bold text-lg shadow-lg hover:bg-violet-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              العب: اختار الطريق 🛤️
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'paths') {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="font-display text-xl font-bold text-violet-700 text-center mb-6">
          اختار الطريق الصح للكنز
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paths.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (selectedPath !== null) return;
                setSelectedPath(p.id);
                if (p.correct) {
                  play('correct');
                  if (!presenterMode) {
                    setTimeout(() => setPhase('chest'), 600);
                  }
                } else {
                  setWrongAttempts((a) => a + 1);
                  play('wrong');
                  setTimeout(() => setSelectedPath(null), 1000);
                }
              }}
              className={`rounded-3xl p-6 border-4 transition-all ${
                selectedPath === p.id
                  ? p.correct
                    ? 'border-sage-500 bg-sage-100'
                    : 'border-clay-500 bg-clay-100'
                  : 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100'
              } focus:outline-none focus:ring-4 focus:ring-gold-300`}
            >
              <div className="text-6xl mb-3 flex justify-center">{p.emoji}</div>
              <p className="font-display text-xl font-bold text-royal-800 text-center">{p.label}</p>
              <AnimatePresence>
                {selectedPath === p.id && !p.correct && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-clay-600 font-bold text-center mt-2"
                  >
                    قريب جدًا! جرّب مرة تانية ❤️
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {presenterMode && selectedPath !== null && paths.find((p) => p.id === selectedPath)?.correct && (
          <div className="text-center mt-6">
            <button
              onClick={() => { play('click'); setPhase('chest'); }}
              className="px-6 py-2 rounded-full bg-violet-500 text-white font-bold shadow-lg hover:bg-violet-600 active:scale-95 transition-all"
            >
              متابعة ✨
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'chest') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          {/* Key appears first */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl mb-2"
          >
            🗝️
          </motion.div>

          {/* Chest opens */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: chestOpen ? [0, -60, 0] : [0, -60, 0] }}
            transition={{ delay: 0.8, duration: 1.2, times: [0, 0.5, 1] }}
            onAnimationComplete={() => {
              if (!chestOpen) {
                setChestOpen(true);
              }
            }}
            className="text-9xl"
          >
            🧰
          </motion.div>

          {/* Glowing treasure */}
          <motion.div
            initial={{ scale: 0, y: 40 }}
            animate={{ scale: chestOpen ? 1 : 0, y: chestOpen ? -20 : 40 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-7xl">📖</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-8"
        >
          <GameCard>
            <p className="font-display text-2xl font-bold text-violet-700 mb-2">
              📖 حكمة الله
            </p>
            <p className="text-lg text-royal-700">
              الحكمة الحقيقية عند الله، والإنسان يحتاج أن يتعلم طريق الله.
            </p>
            {!presenterMode && (
              <button
                onClick={() => setPhase('puzzle')}
                className="mt-6 px-8 py-3 rounded-full bg-violet-500 text-white font-bold text-lg shadow-lg hover:bg-violet-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-violet-300"
              >
                لغز: أين نجد الحكمة؟ 🤔
              </button>
            )}
          </GameCard>
        </motion.div>
      </div>
    );
  }

  if (phase === 'puzzle') {
    return (
      <div className="max-w-2xl mx-auto">
        <GameCard>
          <p className="font-display text-xl font-bold text-violet-700 text-center mb-2">
            أين نجد الحكمة؟
          </p>
          <div className="grid gap-3 mt-4">
            {puzzleOptions.map((opt, idx) => {
              let cls = 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100 text-royal-800';
              if (puzzleSelected !== null) {
                if (opt.correct) cls = 'border-sage-500 bg-sage-100 text-sage-800';
                else if (idx === puzzleSelected) cls = 'border-clay-500 bg-clay-100 text-clay-700';
                else cls = 'border-parchment-200 bg-parchment-50 text-royal-400';
              }
              return (
                <motion.button
                  key={idx}
                  onClick={() => {
                    if (puzzleSelected !== null) return;
                    setPuzzleSelected(idx);
                    if (opt.correct) {
                      play('correct');
                      play('complete');
                      setTimeout(() => setPhase('reward'), 1000);
                    } else {
                      setWrongAttempts((a) => a + 1);
                      play('wrong');
                      setTimeout(() => setPuzzleSelected(null), 1200);
                    }
                  }}
                  disabled={puzzleSelected !== null}
                  animate={puzzleSelected === idx && !opt.correct ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-4 text-lg font-bold transition-all ${cls} ${
                    puzzleSelected === null ? 'hover:scale-[1.02] active:scale-95' : ''
                  } focus:outline-none focus:ring-4 focus:ring-gold-300`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span>{opt.text}</span>
                </motion.button>
              );
            })}
          </div>
        </GameCard>
      </div>
    );
  }

  const stars = wrongAttempts === 0 ? 3 : wrongAttempts <= 1 ? 2 : 1;
  return (
    <StarReward
      stars={stars}
      message="🎉 أحسنت!"
      subtitle="الحكمة الحقيقية عند الله."
      onComplete={() => onComplete(stars)}
    />
  );
}
