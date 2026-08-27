import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station7Props {
  onComplete: (stars: number) => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'test' | 'reveal' | 'sort' | 'reward';
  presenterMode?: boolean;
}

const testButtons = [
  { question: 'هل يتكلم؟', answer: '❌ لا' },
  { question: 'هل يسمع؟', answer: '❌ لا' },
  { question: 'هل يمشي؟', answer: '❌ لا' },
  { question: 'هل يحمي نفسه؟', answer: '❌ لا' },
  { question: 'هل هو حي؟', answer: '❌ لا' },
];

const sortItems = [
  { id: 1, emoji: '🪵', text: 'صنم', isGod: false },
  { id: 2, emoji: '💰', text: 'ذهب', isGod: false },
  { id: 3, emoji: '🌳', text: 'شجرة', isGod: false },
  { id: 4, emoji: '📱', text: 'هاتف', isGod: false },
  { id: 5, emoji: '❤️', text: 'الله', isGod: true },
];

export function Station7({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station7Props) {
  const [phase, setPhase] = useState<'intro' | 'test' | 'reveal' | 'sort' | 'reward'>(startPhase);
  const [pressed, setPressed] = useState<number[]>([]);
  const [sorted, setSorted] = useState<Record<number, boolean | null>>({});
  const [idolBroken, setIdolBroken] = useState(false);

  const allTested = pressed.length === testButtons.length;
  const allSorted = Object.keys(sorted).length === sortItems.length;
  const sortedCorrectly = sortItems.every((item) => sorted[item.id] === item.isGod);

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl"
          >
            🗿
          </motion.div>
        </motion.div>
        <p className="text-lg text-royal-700">
          لو الصنم محتاج حد يحمله... هل يقدر يكون إله؟ 😂
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); setPhase('test'); }}
              className="px-8 py-3 rounded-full bg-stone-600 text-white font-bold text-lg shadow-lg hover:bg-stone-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-stone-400"
            >
              العب: اختبر الصنم 🗿
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'test') {
    return (
      <div className="max-w-2xl mx-auto">
        <GameCard>
          <p className="font-display text-xl font-bold text-stone-700 text-center mb-4">
            اختبر الصنم
          </p>

          <div className="flex justify-center mb-6">
            <motion.div
              animate={
                allTested
                  ? { rotate: 360, scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }
                  : { rotate: [-3, 3, -3] }
              }
              transition={
                allTested
                  ? { duration: 1 }
                  : { duration: 2, repeat: Infinity }
              }
              onAnimationComplete={() => {
                if (allTested && !idolBroken) {
                  setIdolBroken(true);
                  if (!presenterMode) {
                    setTimeout(() => setPhase('reveal'), 800);
                  }
                }
              }}
              className="text-8xl"
            >
              {idolBroken ? '🪵' : '🗿'}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {testButtons.map((btn, i) => {
              const isPressed = pressed.includes(i);
              return (
                <motion.button
                  key={i}
                  whileHover={!isPressed ? { scale: 1.05 } : {}}
                  whileTap={!isPressed ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (!isPressed) {
                      setPressed([...pressed, i]);
                      play('wrong');
                    }
                  }}
                  disabled={isPressed}
                  className={`p-4 rounded-2xl border-4 font-bold text-lg transition-all min-h-[60px] ${
                    isPressed
                      ? 'border-clay-400 bg-clay-100 text-clay-700'
                      : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200'
                  } focus:outline-none focus:ring-4 focus:ring-gold-300`}
                >
                  <p>{btn.question}</p>
                  <AnimatePresence>
                    {isPressed && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black mt-1"
                      >
                        {btn.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {presenterMode && allTested && idolBroken && (
            <div className="text-center mt-4">
              <button
                onClick={() => { play('click'); setPhase('reveal'); }}
                className="px-6 py-2 rounded-full bg-stone-600 text-white font-bold shadow-lg hover:bg-stone-700 active:scale-95 transition-all"
              >
                متابعة ✨
              </button>
            </div>
          )}
        </GameCard>
      </div>
    );
  }

  if (phase === 'reveal') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl mb-4"
        >
          🪵
        </motion.div>
        <GameCard>
          <p className="font-display text-2xl font-bold text-stone-700 mb-2">
            الصنم مصنوع بيد الإنسان
          </p>
          <p className="text-lg text-royal-700 mb-4">
            ليس إلهًا حقيقيًا. تحوّل إلى قطعة خشب عادية! 😊
          </p>
          {!presenterMode && (
            <button
              onClick={() => { play('click'); setPhase('sort'); }}
              className="px-8 py-3 rounded-full bg-stone-600 text-white font-bold text-lg shadow-lg hover:bg-stone-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-stone-400"
            >
              العب: إله ولا لأ؟ 🤔
            </button>
          )}
        </GameCard>
      </div>
    );
  }

  if (phase === 'sort') {
    return (
      <div className="max-w-2xl mx-auto">
        <GameCard>
          <p className="font-display text-xl font-bold text-stone-700 text-center mb-2">
            إله ولا لأ؟
          </p>
          <p className="text-base text-royal-600 text-center mb-4">
            اضغط «إله» على اللي هو الله فقط، و«ليس إله» على الباقي
          </p>

          <div className="grid gap-3">
            {sortItems.map((item) => {
              const val = sorted[item.id];
              let cls = 'border-parchment-300 bg-parchment-50';
              if (val === true) cls = 'border-gold-500 bg-gold-100';
              else if (val === false) cls = 'border-stone-400 bg-stone-200';
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-4 ${cls} transition-all`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="flex-1 font-bold text-royal-800 text-lg">{item.text}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSorted({ ...sorted, [item.id]: true })}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition-all min-h-[36px] ${
                        val === true
                          ? 'bg-gold-500 text-white'
                          : 'bg-gold-200 text-gold-800 hover:bg-gold-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold-400`}
                    >
                      إله
                    </button>
                    <button
                      onClick={() => setSorted({ ...sorted, [item.id]: false })}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition-all min-h-[36px] ${
                        val === false
                          ? 'bg-stone-500 text-white'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      } focus:outline-none focus:ring-2 focus:ring-stone-400`}
                    >
                      ليس إله
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {allSorted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-center"
              >
                {sortedCorrectly ? (
                  <>
                    <p className="font-display text-lg font-bold text-sage-700 mb-3">
                      🎉 ممتاز! الله وحده هو الإله الحقيقي. ❤️
                    </p>
                    <p className="text-base text-royal-700 mb-3">
                      لا نعبد الأصنام، ولا نجعل أي شيء مكان الله.
                    </p>
                    <button
                      onClick={() => { play('correct'); play('complete'); setPhase('reward'); }}
                      className="px-8 py-3 rounded-full bg-stone-600 text-white font-bold text-lg shadow-lg hover:bg-stone-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-stone-400"
                    >
                      متابعة 🎉
                    </button>
                  </>
                ) : (
                  <p className="font-display text-lg font-bold text-clay-600">
                    قريب جدًا! جرّب مرة تانية ❤️
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GameCard>
      </div>
    );
  }

  return (
    <StarReward
      stars={3}
      message="🎉 أحسنت!"
      subtitle="لا نعبد الأصنام، ولا نجعل أي شيء مكان الله."
      onComplete={() => onComplete(3)}
    />
  );
}
