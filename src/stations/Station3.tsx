import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station3Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'sos' | 'order' | 'reward';
  presenterMode?: boolean;
}

const correctOrder = [
  { id: 1, emoji: '😔', text: 'أدرك إني غلطت' },
  { id: 2, emoji: '❤️', text: 'أعترف' },
  { id: 3, emoji: '🙏', text: 'أصلي' },
  { id: 4, emoji: '🚶', text: 'أرجع لربنا' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Station3({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station3Props) {
  const [phase, setPhase] = useState<'intro' | 'sos' | 'order' | 'reward'>(startPhase);
  const [sosPressed, setSosPressed] = useState(presenterMode && startPhase === 'sos');
  const [light, setLight] = useState(false);
  const [cards, setCards] = useState(() => shuffle(correctOrder));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  // In presenter mode, auto-play the SOS light animation when entering at 'sos'
  useEffect(() => {
    if (presenterMode && startPhase === 'sos') {
      const t = setTimeout(() => setLight(true), 800);
      return () => clearTimeout(t);
    }
  }, [presenterMode, startPhase]);

  const handleSos = () => {
    setSosPressed(true);
    setLight(false);
    setTimeout(() => setLight(true), 800);
    if (!presenterMode) {
      setTimeout(() => setPhase('order'), 2600);
    }
  };

  const moveCard = (idx: number, dir: -1 | 1) => {
    setCards((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const checkOrder = () => {
    const isCorrect = cards.every((c, i) => c.id === correctOrder[i].id);
    if (isCorrect) {
      setFeedback('🎉 ممتاز! عرفت طريق الرجوع.');
      play('correct');
      play('complete');
      setTimeout(() => setPhase('reward'), 1200);
    } else {
      setAttempts((a) => a + 1);
      setFeedback('قريب جدًا! جرّب مرة تانية ❤️');
      play('wrong');
      setTimeout(() => setFeedback(null), 1500);
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
          <div className="w-40 h-40 rounded-full bg-gradient-to-b from-sky-200 to-sky-400 shadow-xl border-4 border-sky-500 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🙏
            </motion.div>
          </div>
        </motion.div>
        <p className="text-lg text-royal-700">
          لما نغلط ونبعد... نروح لمين؟
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); setPhase('sos'); }}
              className="px-8 py-3 rounded-full bg-sky-500 text-white font-bold text-lg shadow-lg hover:bg-sky-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-sky-300"
            >
              اضغط SOS 🆘
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'sos') {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backgroundColor: light
              ? 'rgba(253, 251, 245, 1)'
              : 'rgba(20, 27, 87, 1)',
          }}
          transition={{ duration: 1.5 }}
          className={`rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden ${
            light ? 'text-royal-900' : 'text-white'
          }`}
        >
          {/* Light spread effect */}
          {sosPressed && light && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-radial from-gold-300 to-transparent pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(252,211,77,0.6), transparent 70%)' }}
            />
          )}

          <AnimatePresence mode="wait">
            {!sosPressed && (
              <motion.button
                key="sos-btn"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.15, 1] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={handleSos}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 text-white font-display text-5xl font-black shadow-2xl border-4 border-white hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-8 focus:ring-clay-300 relative z-10"
              >
                🆘
              </motion.button>
            )}

            {sosPressed && !light && (
              <motion.p
                key="calling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-3xl font-bold relative z-10"
              >
                يا رب ارحمنا ❤️
              </motion.p>
            )}

            {sosPressed && light && (
              <motion.div
                key="answered"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 relative z-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-7xl"
                >
                  ☀️
                </motion.div>
                <p className="font-display text-2xl font-bold text-gold-700">
                  الشعب صلى إلى الله وطلب رحمته.
                </p>
                <p className="text-lg text-royal-700">
                  لما نغلط، لا نهرب من ربنا... نرجع له.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (phase === 'reward') {
    const stars = attempts === 0 ? 3 : attempts <= 1 ? 2 : 1;
    return (
      <StarReward
        stars={stars}
        message="🎉 أحسنت!"
        subtitle="عرفت طريق الرجوع إلى الله."
        onComplete={() => onComplete(stars)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GameCard>
        <p className="font-display text-xl font-bold text-sky-700 text-center mb-2">
          رتّب خطوات الرجوع إلى الله
        </p>
        <p className="text-base text-royal-600 text-center mb-4">
          استخدم الأسهم لتحريك البطاقات للترتيب الصح
        </p>

        <div className="space-y-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-sky-50 border-4 border-sky-200 rounded-2xl p-4"
            >
              <span className="text-2xl font-black text-sky-300 w-6 text-center">{i + 1}</span>
              <span className="text-3xl">{card.emoji}</span>
              <span className="flex-1 text-lg font-bold text-royal-800">{card.text}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveCard(i, -1)}
                  disabled={i === 0}
                  className="w-11 h-11 rounded-full bg-sky-500 text-white font-bold disabled:opacity-30 hover:bg-sky-600 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-sky-300"
                  aria-label="تحريك لليسار"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveCard(i, 1)}
                  disabled={i === cards.length - 1}
                  className="w-11 h-11 rounded-full bg-sky-500 text-white font-bold disabled:opacity-30 hover:bg-sky-600 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-sky-300"
                  aria-label="تحريك لليمين"
                >
                  ↓
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center font-bold text-lg mt-4 ${
                feedback.includes('ممتاز') ? 'text-sage-600' : 'text-clay-600'
              }`}
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={checkOrder}
          className="w-full mt-4 py-3 rounded-full bg-sky-500 text-white font-bold text-lg shadow-lg hover:bg-sky-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-sky-300"
        >
          تحقّق من الترتيب ✓
        </button>
      </GameCard>
    </div>
  );
}
