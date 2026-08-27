import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station2Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'magic' | 'game' | 'reward';
  presenterMode?: boolean;
}

interface Scenario {
  id: number;
  situation: string;
  options: { text: string; emoji: string; correct: boolean }[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: 'غلطت في حق صاحبي...',
    options: [
      { text: 'قلت: مش أنا!', emoji: '🙈', correct: false },
      { text: 'اعتذرت له', emoji: '😔', correct: false },
      { text: 'اعتذرت وحاولت أصلح', emoji: '🤝', correct: true },
    ],
  },
  {
    id: 2,
    situation: 'كسرت كاسة في البيت...',
    options: [
      { text: 'خبّيت الكسر وأخدت كاسة تانية', emoji: '🙈', correct: false },
      { text: 'قلت لأمي: أنا آسف، أنا اللي كسرتها', emoji: '😔', correct: false },
      { text: 'اعتذرت وساعدت في التنظيف', emoji: '🤝', correct: true },
    ],
  },
  {
    id: 3,
    situation: 'نسيت أكتب واجبي...',
    options: [
      { text: 'قلت: المعلمة ما قالوش', emoji: '🙈', correct: false },
      { text: 'قلت: أنا آسف، هكتبه دلوقتي', emoji: '😔', correct: false },
      { text: 'اعتذرت وكتبته فورًا', emoji: '🤝', correct: true },
    ],
  },
];

export function Station2({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station2Props) {
  const [phase, setPhase] = useState<'intro' | 'magic' | 'game' | 'reward'>(startPhase);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [mirrorLit, setMirrorLit] = useState(false);

  // In presenter mode, auto-play the mirror animation when entering at 'magic'
  useEffect(() => {
    if (presenterMode && startPhase === 'magic') {
      const t = setTimeout(() => setMirrorLit(true), 1000);
      return () => clearTimeout(t);
    }
  }, [presenterMode, startPhase]);

  const sc = scenarios[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (sc.options[idx].correct) {
      setCorrectCount((c) => c + 1);
      play('correct');
    } else {
      play('wrong');
    }
  };

  const handleNext = () => {
    if (current < scenarios.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      play('click');
    } else {
      play('complete');
      setPhase('reward');
    }
  };

  const startMagic = () => {
    setPhase('magic');
    setMirrorLit(false);
    setTimeout(() => setMirrorLit(true), 1000);
    if (!presenterMode) {
      setTimeout(() => setPhase('game'), 3000);
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
          <div className="w-40 h-56 rounded-full bg-gradient-to-b from-parchment-200 to-parchment-400 shadow-xl border-4 border-parchment-500 flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              🪞
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
        <p className="text-lg text-royal-700">
          هل أسهل حاجة إنك تعترف إنك غلطت؟
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); startMagic(); }}
              className="px-8 py-3 rounded-full bg-rose-500 text-white font-bold text-lg shadow-lg hover:bg-rose-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-rose-300"
            >
              العب: اختار التصرف الصح 🤔
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'magic') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          animate={{
            backgroundColor: mirrorLit ? 'rgba(253, 251, 245, 1)' : 'rgba(50, 50, 80, 1)',
          }}
          transition={{ duration: 1.5 }}
          className="inline-flex items-center justify-center w-48 h-64 rounded-full border-4 border-parchment-500 shadow-2xl"
        >
          <motion.div
            animate={{ scale: mirrorLit ? 1.2 : 1, opacity: mirrorLit ? 1 : 0.5 }}
            transition={{ duration: 1 }}
            className="text-7xl"
          >
            🪞
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: mirrorLit ? 1 : 0 }}
          className="font-display text-xl font-bold text-royal-700 mt-4"
        >
          المراية تضيء... ✨
        </motion.p>
      </div>
    );
  }

  if (phase === 'reward') {
    const stars = correctCount >= 3 ? 3 : correctCount >= 2 ? 2 : 1;
    return (
      <StarReward
        stars={stars}
        message="🎉 أحسنت!"
        subtitle="الاعتراف طريق الرجوع إلى الله."
        onComplete={() => onComplete(stars)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center gap-2 mb-4">
        {scenarios.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < current ? 'bg-sage-500' : i === current ? 'bg-rose-500 scale-125' : 'bg-parchment-300'
            } transition-all`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
        >
          <GameCard>
            <p className="font-display text-2xl font-bold text-rose-700 text-center mb-2">
              اختار التصرف الصح
            </p>
            <p className="text-xl text-royal-800 text-center mb-6 font-semibold">
              {sc.situation}
            </p>
            <div className="grid gap-3">
              {sc.options.map((opt, idx) => {
                let cls = 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100 text-royal-800';
                if (selected !== null) {
                  if (opt.correct) cls = 'border-sage-500 bg-sage-100 text-sage-800';
                  else if (idx === selected) cls = 'border-clay-500 bg-clay-100 text-clay-700';
                  else cls = 'border-parchment-200 bg-parchment-50 text-royal-400';
                }
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    animate={selected === idx && !opt.correct ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-4 text-lg font-bold transition-all ${cls} ${
                      selected === null ? 'hover:scale-[1.02] active:scale-95' : ''
                    } focus:outline-none focus:ring-4 focus:ring-gold-300`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span>{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5"
                >
                  <div
                    className={`rounded-2xl p-4 text-center font-bold text-lg ${
                      sc.options[selected].correct
                        ? 'bg-sage-100 text-sage-700'
                        : 'bg-gold-100 text-gold-800'
                    }`}
                  >
                    {sc.options[selected].correct
                      ? '🎉 أحسنت! الاعتراف والصلح هو الطريق الصح!'
                      : 'قريب جدًا! جرّب مرة تانية ❤️'}
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full mt-4 py-3 rounded-full bg-rose-500 text-white font-bold text-lg shadow-lg hover:bg-rose-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-rose-300"
                  >
                    {current < scenarios.length - 1 ? 'الموقف التالي' : 'إنهاء'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GameCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
