import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station5Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'game' | 'reward';
  presenterMode?: boolean;
}

interface Child {
  id: number;
  x: number;
  y: number;
  returned: boolean;
}

const initialChildren: Child[] = [
  { id: 1, x: 15, y: 80, returned: false },
  { id: 2, x: 25, y: 20, returned: false },
  { id: 3, x: 75, y: 85, returned: false },
  { id: 4, x: 85, y: 25, returned: false },
];

export function Station5({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station5Props) {
  const [phase, setPhase] = useState<'intro' | 'game' | 'reward'>(startPhase);
  const [children, setChildren] = useState<Child[]>(initialChildren);

  const returnedCount = children.filter((c) => c.returned).length;
  const allReturned = returnedCount === children.length;

  const returnChild = (id: number) => {
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, returned: true, x: 50, y: 40 }
          : c
      )
    );
    play('correct');
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-display font-bold text-teal-700"
        >
          🏙️ أورشليم تنادي أولادها
        </motion.div>
        <p className="text-lg text-royal-700">
          ساعدوا أولاد أورشليم أن يعودوا إلى مدينتهم!
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); setPhase('game'); }}
              className="px-8 py-3 rounded-full bg-teal-500 text-white font-bold text-lg shadow-lg hover:bg-teal-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-300"
            >
              العب: ساعد الأولاد يرجعوا 🏠
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'reward') {
    return (
      <StarReward
        stars={2}
        message="🎉 أحسنت!"
        subtitle="رجوع الأولاد يضيء أورشليم. لم يختفِ الرجاء."
        onComplete={() => onComplete(2)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GameCard>
        <p className="font-display text-xl font-bold text-teal-700 text-center mb-2">
          ساعد الأولاد يرجعوا إلى أورشليم
        </p>
        <p className="text-base text-royal-600 text-center mb-4">
          اضغط على كل ولد ليرجع إلى المدينة! ({returnedCount}/{children.length})
        </p>

        <motion.div
          animate={{
            backgroundColor: allReturned
              ? 'rgba(253, 251, 245, 1)'
              : 'rgba(234, 217, 163, 0.4)',
          }}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-teal-300"
        >
          {/* Jerusalem city */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <motion.div
              animate={{ scale: allReturned ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: allReturned ? Infinity : 0 }}
              className="text-5xl"
            >
              🏛️
            </motion.div>
            <span className="text-xs font-bold text-teal-800 bg-white/80 px-2 rounded-full mt-1">
              أورشليم
            </span>
          </div>

          {/* Children */}
          {children.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => !c.returned && returnChild(c.id)}
              disabled={c.returned}
              initial={false}
              animate={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                scale: c.returned ? 0 : 1,
                opacity: c.returned ? 0 : 1,
              }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl cursor-pointer hover:scale-125 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ position: 'absolute' }}
              aria-label={`ولد ${c.id}`}
            >
              {c.returned ? '✨' : '🧒'}
            </motion.button>
          ))}

          {/* Brightening overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: allReturned
                ? 'radial-gradient(circle at center, rgba(252, 211, 77, 0.4), transparent 70%)'
                : 'radial-gradient(circle at center, transparent, transparent 70%)',
            }}
            transition={{ duration: 1 }}
          />
        </motion.div>

        <AnimatePresence>
          {allReturned && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <p className="font-display text-xl font-bold text-teal-700 mb-3">
                رغم الحزن، لم يختفِ الرجاء! أورشليم تنادي أولادها وترحّب برجوعهم.
              </p>
              <button
                onClick={() => { play('complete'); setPhase('reward'); }}
                className="px-8 py-3 rounded-full bg-teal-500 text-white font-bold text-lg shadow-lg hover:bg-teal-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-300"
              >
                متابعة ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </GameCard>
    </div>
  );
}
