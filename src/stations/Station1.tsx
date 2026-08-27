import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { StarReward } from '@/components/StarReward';
import type { SoundType } from '@/hooks/useSound';

interface Station1Props {
  onComplete: (stars: number) => void;
  onBack: () => void;
  play?: (type: SoundType) => void;
  startPhase?: 'intro' | 'magic' | 'game' | 'reward';
  presenterMode?: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

const obstacles: Obstacle[] = [
  { x: 30, y: 20, w: 14, h: 14 },
  { x: 55, y: 55, w: 16, h: 16 },
  { x: 70, y: 25, w: 12, h: 12 },
  { x: 40, y: 70, w: 14, h: 14 },
];

export function Station1({ onComplete, play = () => {}, startPhase = 'intro', presenterMode = false }: Station1Props) {
  const [phase, setPhase] = useState<'intro' | 'magic' | 'game' | 'reward'>(startPhase);
  const [pos, setPos] = useState({ x: 8, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [stars, setStars] = useState(1);
  const arenaRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // In presenter mode, auto-play the magic animation when entering at 'magic'
  useEffect(() => {
    if (presenterMode && startPhase === 'magic') {
      const t1 = setTimeout(() => setScrollOpen(true), 800);
      return () => clearTimeout(t1);
    }
  }, [presenterMode, startPhase]);

  const checkCollision = (x: number, y: number) => {
    const letterBox = { x, y, w: 8, h: 8 };
    for (const o of obstacles) {
      if (
        letterBox.x < o.x + o.w &&
        letterBox.x + letterBox.w > o.x &&
        letterBox.y < o.y + o.h &&
        letterBox.y + letterBox.h > o.y
      ) {
        return true;
      }
    }
    return false;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    offsetRef.current = { x: px - pos.x, y: py - pos.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    let nx = px - offsetRef.current.x;
    let ny = py - offsetRef.current.y;
    nx = Math.max(0, Math.min(92, nx));
    ny = Math.max(0, Math.min(92, ny));

    if (checkCollision(nx, ny)) {
      setFailed(true);
      setDragging(false);
      play('wrong');
      setTimeout(() => {
        setFailed(false);
        setPos({ x: 8, y: 50 });
      }, 1000);
      return;
    }
    setPos({ x: nx, y: ny });

    if (nx > 86 && ny > 38 && ny < 62) {
      setDragging(false);
      setStars(2);
      play('correct');
      play('complete');
      setPhase('reward');
    }
  };

  const handlePointerUp = () => setDragging(false);

  const startMagic = () => {
    setPhase('magic');
    setScrollOpen(false);
    setTimeout(() => setScrollOpen(true), 800);
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
          <div className="relative">
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-40 h-48 bg-gradient-to-b from-parchment-100 to-parchment-300 rounded-lg shadow-xl border-4 border-parchment-500 flex items-center justify-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-clay-600 rounded-b-lg shadow" />
              <div className="text-center px-4">
                <p className="font-serif text-2xl text-parchment-800">رسالة</p>
                <p className="font-serif text-sm text-parchment-700 mt-1">باروخ</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <p className="text-lg text-royal-700">
          لو كان عندك رسالة مهمة جدًا... هل تقدر توصلها؟
        </p>
        <div className="flex justify-center">
          {!presenterMode && (
            <button
              onClick={() => { play('click'); startMagic(); }}
              className="px-8 py-3 rounded-full bg-royal-500 text-white font-bold text-lg shadow-lg hover:bg-royal-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-royal-300"
            >
              العب: وصل الرسالة 📜
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
          initial={{ scale: 1 }}
          animate={{ scale: scrollOpen ? 1.3 : 1, rotate: scrollOpen ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 1 }}
          className="relative inline-block"
        >
          <div className="w-48 h-56 bg-gradient-to-b from-parchment-100 to-parchment-300 rounded-lg shadow-2xl border-4 border-parchment-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-clay-600 rounded-b-lg shadow" />
            <AnimatePresence>
              {scrollOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center px-4"
                >
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="font-serif text-xl text-parchment-800"
                  >
                    رسالة باروخ
                  </motion.p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-3xl mt-2"
                  >
                    ✨
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollOpen ? 1 : 0 }}
          className="font-display text-xl font-bold text-royal-700 mt-4"
        >
          الرسالة تفتح... ✨
        </motion.p>
      </div>
    );
  }

  if (phase === 'reward') {
    return (
      <StarReward
        stars={stars}
        message="🎉 أحسنت!"
        subtitle="وصلت الرسالة! باروخ كان يحمل رسالة مهمة للشعب."
        onComplete={() => onComplete(stars)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GameCard>
        <p className="font-display text-xl font-bold text-royal-800 text-center mb-2">
          وصل الرسالة 📜
        </p>
        <p className="text-base text-royal-600 text-center mb-4">
          اسحب الرسالة من «باروخ» إلى «الشعب» وتجنب العوائق!
        </p>

        <div
          ref={arenaRef}
          className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-sky-100 to-sage-100 overflow-hidden border-4 border-parchment-300 touch-none select-none"
        >
          <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '4%', top: '50%' }}>
            <div className="w-12 h-12 rounded-full bg-royal-500 flex items-center justify-center text-2xl shadow-lg border-2 border-white">
              ✍️
            </div>
            <span className="text-xs font-bold text-royal-800 bg-white/80 px-2 rounded-full mt-1">باروخ</span>
          </div>

          <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '96%', top: '50%' }}>
            <div className="w-12 h-12 rounded-full bg-sage-500 flex items-center justify-center text-2xl shadow-lg border-2 border-white">
              👥
            </div>
            <span className="text-xs font-bold text-sage-800 bg-white/80 px-2 rounded-full mt-1">الشعب</span>
          </div>

          {obstacles.map((o, i) => (
            <div
              key={i}
              className="absolute rounded-lg bg-stone-400/70 border-2 border-stone-500 flex items-center justify-center text-xl"
              style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` }}
            >
              🪨
            </div>
          ))}

          <motion.div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            animate={{ x: 0, y: 0 }}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, touchAction: 'none' }}
          >
            <motion.div
              animate={failed ? { x: [0, -10, 10, 0], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-12 h-14 bg-parchment-100 rounded-md shadow-lg border-2 ${failed ? 'border-clay-500' : 'border-parchment-500'} flex items-center justify-center text-xl`}
            >
              📜
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {failed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-clay-500/30"
              >
                <p className="font-display text-2xl font-bold text-clay-700 bg-white px-6 py-3 rounded-full shadow-lg">
                  قريب جدًا! جرّب مرة تانية ❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GameCard>
    </div>
  );
}
