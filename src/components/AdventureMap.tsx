import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, CheckCircle2, Star, MapPin } from 'lucide-react';
import { stations } from '@/data/stations';

interface AdventureMapProps {
  completedStations: number[];
  stationStars: Record<number, number>;
  allUnlocked: boolean;
  onSelectStation: (id: number) => void;
  onStartJourney: () => void;
  finalUnlocked: boolean;
  onFinalChallenge: () => void;
  onEasterEgg: () => void;
  revealStep: number;
  onNext: () => void;
  onPrev: () => void;
}

const TOTAL_STEPS = 8;

const stepContent = [
  { icon: '📜', title: 'رحلة باروخ', subtitle: 'من الحزن إلى الرجاء', description: 'هنعرف رحلة باروخ خطوة بخطوة. اضغط السهم الأيمن لكشف المحطات.' },
  ...stations.map((s) => ({ icon: s.icon, title: s.title, subtitle: s.subtitle, description: s.description })),
  { icon: '🏆', title: 'التحدي النهائي', subtitle: 'اختبر معلوماتك', description: 'اختبر معلوماتك في رحلة باروخ بأكملها.' },
];

export function AdventureMap({
  completedStations,
  stationStars,
  allUnlocked,
  onSelectStation,
  onStartJourney,
  finalUnlocked,
  onFinalChallenge,
  onEasterEgg,
  revealStep,
  onNext,
  onPrev,
}: AdventureMapProps) {
  const [lockedMessage, setLockedMessage] = useState<number | null>(null);

  const isUnlocked = (id: number) => {
    if (allUnlocked) return true;
    if (id === 1) return true;
    return completedStations.includes(id - 1);
  };

  const isCompleted = (id: number) => completedStations.includes(id);
  const allCompleted = completedStations.length === stations.length;

  const getStationState = (index: number): 'locked' | 'past' | 'active' => {
    if (revealStep === 0) return 'locked';
    if (revealStep === index + 1) return 'active';
    if (revealStep > index + 1) return 'past';
    return 'locked';
  };

  const finalActive = revealStep === TOTAL_STEPS;
  const isPathDrawn = (i: number) => revealStep > i + 1;

  const activeContent = stepContent[revealStep] ?? stepContent[0];

  const handleStationClick = (id: number, index: number) => {
    if (getStationState(index) === 'locked') return;
    if (isUnlocked(id)) {
      onSelectStation(id);
    } else {
      setLockedMessage(id);
      setTimeout(() => setLockedMessage(null), 2500);
    }
  };

  const allRevealed = revealStep >= TOTAL_STEPS;

  return (
    <div className="relative">
      {/* ===== Cinematic map container ===== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-950 via-amber-950/30 to-stone-950 min-h-[500px] md:min-h-[620px]">
        {/* Vignette for projector contrast */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)' }}
        />

        {/* Floating dust motes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold-400/20"
              style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.4, 0] }}
              transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center"
        >
          <h2
            className="font-display text-2xl md:text-4xl font-black text-gold-400 mb-0.5"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            📜 رحلة باروخ
          </h2>
          <p className="font-display text-sm md:text-lg font-bold text-gold-200/70">من الحزن إلى الرجاء</p>
        </motion.div>

        {/* Step dots */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: revealStep === i + 1 ? 1.4 : 1,
                backgroundColor: i < revealStep ? '#fbbf24' : revealStep === i + 1 ? '#fbbf24' : '#57534e',
                opacity: i < revealStep ? 0.8 : revealStep === i + 1 ? 1 : 0.4,
              }}
              className="w-2.5 h-2.5 rounded-full"
            />
          ))}
        </div>

        {/* ===== Desktop / Tablet map ===== */}
        <div className="relative aspect-[4/3] md:aspect-[16/9] min-h-[420px] hidden sm:block z-10">
          {/* Corner ornaments */}
          {[
            { pos: 'top-0 left-0', rotate: 0 },
            { pos: 'top-0 right-0', rotate: 90 },
            { pos: 'bottom-0 right-0', rotate: 180 },
            { pos: 'bottom-0 left-0', rotate: 270 },
          ].map((corner, i) => (
            <div
              key={i}
              className={`absolute ${corner.pos} w-10 h-10 md:w-14 md:h-14 pointer-events-none z-10`}
              style={{ transform: `rotate(${corner.rotate}deg)` }}
            >
              <svg viewBox="0 0 56 56" className="w-full h-full text-gold-600/20">
                <path d="M0 28 Q0 0 28 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 28 Q8 8 28 8" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="4" cy="4" r="2" fill="currentColor" />
              </svg>
            </div>
          ))}

          {/* Compass rose */}
          <div className="absolute bottom-3 left-3 w-12 h-12 md:w-16 md:h-16 opacity-15 pointer-events-none z-10">
            <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M32 4 L36 32 L32 60 L28 32 Z" fill="currentColor" opacity="0.6" />
              <path d="M4 32 L32 28 L60 32 L32 36 Z" fill="currentColor" opacity="0.3" />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Spotlight on active station */}
          {revealStep >= 1 && revealStep <= 7 && (
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out rounded-full z-10"
              style={{
                left: `${stations[revealStep - 1].mapPosition.x}%`,
                top: `${stations[revealStep - 1].mapPosition.y}%`,
                width: '280px',
                height: '280px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
              }}
            />
          )}
          {finalActive && (
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out rounded-full z-10"
              style={{
                left: '50%',
                top: '10%',
                width: '280px',
                height: '280px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
              }}
            />
          )}

          {/* SVG path connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="mapPathGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path to final challenge */}
            <motion.line
              x1={stations[6].mapPosition.x}
              y1={stations[6].mapPosition.y}
              x2={50}
              y2={10}
              stroke="#fbbf24"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="1.5 1"
              filter="url(#mapPathGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: finalActive ? 1 : 0, opacity: finalActive ? 0.7 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Station-to-station paths */}
            {stations.slice(0, -1).map((s, i) => {
              const next = stations[i + 1];
              const drawn = isPathDrawn(i);
              return (
                <motion.line
                  key={s.id}
                  x1={s.mapPosition.x}
                  y1={s.mapPosition.y}
                  x2={next.mapPosition.x}
                  y2={next.mapPosition.y}
                  stroke="#fbbf24"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeDasharray="1.5 1"
                  filter="url(#mapPathGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: drawn ? 1 : 0,
                    opacity: drawn ? 0.7 : 0,
                    strokeDashoffset: drawn ? [0, -2.5] : 0,
                  }}
                  transition={{
                    pathLength: { duration: 0.8, ease: 'easeInOut' },
                    opacity: { duration: 0.3 },
                    strokeDashoffset: { duration: 3, repeat: Infinity, ease: 'linear' },
                  }}
                />
              );
            })}
          </svg>

          {/* Station markers */}
          <div className="relative w-full h-full z-10">
            {stations.map((s, i) => {
              const state = getStationState(i);
              const isActive = state === 'active';
              const isPast = state === 'past';
              const isLocked = state === 'locked';
              const completed = isCompleted(s.id);
              const stars = stationStars[s.id] ?? 0;
              const clickable = !isLocked && isUnlocked(s.id);

              return (
                <motion.button
                  key={s.id}
                  onClick={() => handleStationClick(s.id, i)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.15 : isPast ? 1 : isLocked ? 0.8 : 1,
                    opacity: isLocked ? 0.3 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  whileHover={clickable ? { scale: 1.25, y: -6 } : {}}
                  whileTap={clickable ? { scale: 0.95 } : {}}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${s.mapPosition.x}%`, top: `${s.mapPosition.y}%` }}
                  aria-label={`المحطة ${s.id}: ${s.title}`}
                >
                  {/* Active glow rings */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute rounded-full bg-gold-400/20"
                        style={{ width: '160%', height: '160%' }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-gold-400/10"
                        style={{ width: '200%', height: '200%' }}
                        animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                      />
                      {/* Light rays */}
                      {Array.from({ length: 8 }).map((_, ri) => (
                        <motion.div
                          key={ri}
                          className="absolute bg-gradient-to-t from-gold-400/40 to-transparent"
                          style={{
                            width: 2,
                            height: 50,
                            transformOrigin: 'bottom center',
                            transform: `rotate(${ri * 45}deg) translateY(-25px)`,
                          }}
                          animate={{ opacity: [0.15, 0.5, 0.15] }}
                          transition={{ duration: 2, repeat: Infinity, delay: ri * 0.15 }}
                        />
                      ))}
                    </>
                  )}

                  {/* Medallion */}
                  <div
                    className={`relative rounded-full border-4 flex items-center justify-center transition-all ${
                      isActive
                        ? `w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${s.color} border-gold-300 shadow-2xl`
                        : isPast
                        ? `w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${s.color} border-gold-500/40 shadow-lg`
                        : 'w-11 h-11 md:w-14 md:h-14 bg-stone-800 border-stone-700 shadow-md'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-stone-600" />
                    ) : (
                      <span className={isActive ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}>
                        {s.icon}
                      </span>
                    )}

                    {/* Past check mark */}
                    {isPast && completed && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260 }}
                        className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-sage-500 flex items-center justify-center border-2 border-white shadow-md"
                      >
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 px-3 py-1 rounded-full text-center backdrop-blur-sm transition-all ${
                      isActive
                        ? 'bg-gold-400/15 border border-gold-400/40 shadow-lg'
                        : isPast
                        ? 'bg-stone-800/60 border border-stone-600/50'
                        : 'bg-stone-900/50 border border-stone-800/50'
                    }`}
                  >
                    <p
                      className={`font-display font-bold leading-tight ${
                        isActive
                          ? 'text-gold-200 text-sm md:text-base'
                          : isPast
                          ? 'text-gold-400/70 text-xs md:text-sm'
                          : 'text-stone-500 text-[10px] md:text-xs'
                      }`}
                    >
                      {s.title}
                    </p>
                    {isActive && (
                      <p className="text-[10px] md:text-xs text-gold-300/80 font-semibold">{s.subtitle}</p>
                    )}
                  </div>

                  {/* Stars for completed past stations */}
                  {isPast && completed && (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 3 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`w-3 h-3 ${si < stars ? 'fill-gold-400 text-gold-500' : 'fill-stone-700 text-stone-600'}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}

            {/* Final challenge marker */}
            <motion.button
              onClick={finalActive && finalUnlocked ? onFinalChallenge : undefined}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: finalActive ? 1.15 : 1,
                opacity: finalActive ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={finalActive && finalUnlocked ? { scale: 1.25 } : {}}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: '50%', top: '10%' }}
              aria-label="التحدي النهائي"
            >
              {finalActive && (
                <motion.div
                  className="absolute rounded-full bg-gold-400/20"
                  style={{ width: '160%', height: '160%' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div
                className={`relative rounded-2xl border-4 flex items-center justify-center transition-all ${
                  finalActive
                    ? 'w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gold-400 via-gold-500 to-royal-600 border-gold-200 shadow-2xl'
                    : 'w-12 h-12 md:w-16 md:h-16 bg-stone-800 border-stone-700 shadow-md'
                }`}
              >
                {finalActive ? (
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl md:text-5xl"
                  >
                    🏆
                  </motion.span>
                ) : (
                  <Lock className="w-4 h-4 md:w-5 md:h-5 text-stone-600" />
                )}
              </div>
              <div
                className={`mt-2 px-3 py-1 rounded-full text-center backdrop-blur-sm transition-all ${
                  finalActive
                    ? 'bg-gold-400/15 border border-gold-400/40 shadow-lg'
                    : 'bg-stone-900/50 border border-stone-800/50'
                }`}
              >
                <p
                  className={`font-display font-bold leading-tight ${
                    finalActive ? 'text-gold-200 text-sm md:text-base' : 'text-stone-500 text-[10px] md:text-xs'
                  }`}
                >
                  التحدي النهائي
                </p>
              </div>
            </motion.button>

            {/* Easter egg */}
            {allCompleted && allRevealed && (
              <motion.button
                onClick={onEasterEgg}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: 1 }}
                transition={{ scale: { duration: 2, repeat: Infinity }, opacity: { duration: 0.5 } }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl"
                style={{ left: '50%', top: '88%' }}
                aria-label="سر"
              >
                ✨
              </motion.button>
            )}
          </div>
        </div>

        {/* ===== Mobile vertical path ===== */}
        <div className="sm:hidden px-4 pt-28 pb-32 z-10 relative">
          <div className="space-y-0">
            {stations.map((s, i) => {
              const state = getStationState(i);
              const isActive = state === 'active';
              const isPast = state === 'past';
              const isLocked = state === 'locked';
              const completed = isCompleted(s.id);
              const stars = stationStars[s.id] ?? 0;
              const clickable = !isLocked && isUnlocked(s.id);

              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <motion.button
                      onClick={() => handleStationClick(s.id, i)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        opacity: isLocked ? 0.3 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`relative rounded-full border-4 flex items-center justify-center transition-all ${
                        isActive
                          ? `w-16 h-16 bg-gradient-to-br ${s.color} border-gold-300 shadow-2xl`
                          : isPast
                          ? `w-12 h-12 bg-gradient-to-br ${s.color} border-gold-500/40 shadow-lg`
                          : 'w-10 h-10 bg-stone-800 border-stone-700 shadow-md'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute rounded-full bg-gold-400/20 -inset-2"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-stone-600" />
                      ) : (
                        <span className={isActive ? 'text-2xl' : 'text-xl'}>{s.icon}</span>
                      )}
                      {isPast && completed && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sage-500 flex items-center justify-center border border-white">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                    {i < stations.length - 1 && (
                      <div
                        className={`w-1 h-8 rounded-full transition-all duration-700 ${
                          isPathDrawn(i) ? 'bg-gold-400/60' : 'bg-stone-700/40'
                        }`}
                      />
                    )}
                  </div>

                  <div
                    className={`flex-1 px-4 py-3 rounded-2xl backdrop-blur-sm transition-all ${
                      isActive
                        ? 'bg-gold-400/10 border border-gold-400/40 shadow-lg'
                        : isPast
                        ? 'bg-stone-800/60 border border-stone-600/50'
                        : 'bg-stone-900/50 border border-stone-800/50'
                    }`}
                  >
                    <p
                      className={`font-display font-bold ${
                        isActive ? 'text-gold-200 text-base' : isPast ? 'text-gold-400/70 text-sm' : 'text-stone-500 text-xs'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        isActive ? 'text-gold-300/80' : isPast ? 'text-stone-400' : 'text-stone-600'
                      }`}
                    >
                      {s.subtitle}
                    </p>
                    {isPast && completed && (
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 3 }).map((_, si) => (
                          <Star
                            key={si}
                            className={`w-3 h-3 ${si < stars ? 'fill-gold-400 text-gold-500' : 'fill-stone-700 text-stone-600'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Final challenge on mobile */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <motion.button
                  onClick={finalActive && finalUnlocked ? onFinalChallenge : undefined}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: finalActive ? 1.15 : 1, opacity: finalActive ? 1 : 0.3 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`relative rounded-2xl border-4 flex items-center justify-center transition-all ${
                    finalActive
                      ? 'w-16 h-16 bg-gradient-to-br from-gold-400 via-gold-500 to-royal-600 border-gold-200 shadow-2xl'
                      : 'w-10 h-10 bg-stone-800 border-stone-700 shadow-md'
                  }`}
                >
                  {finalActive ? (
                    <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">
                      🏆
                    </motion.span>
                  ) : (
                    <Lock className="w-4 h-4 text-stone-600" />
                  )}
                </motion.button>
              </div>
              <div
                className={`flex-1 px-4 py-3 rounded-2xl backdrop-blur-sm transition-all ${
                  finalActive
                    ? 'bg-gold-400/10 border border-gold-400/40 shadow-lg'
                    : 'bg-stone-900/50 border border-stone-800/50'
                }`}
              >
                <p className={`font-display font-bold ${finalActive ? 'text-gold-200 text-base' : 'text-stone-500 text-xs'}`}>
                  التحدي النهائي
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Narration banner ===== */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={revealStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-stone-900/80 backdrop-blur-md rounded-2xl border border-gold-700/30 px-6 py-4 md:px-8 md:py-5 text-center shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-3xl md:text-4xl">{activeContent.icon}</span>
                <div className="text-right">
                  <p
                    className="font-display text-lg md:text-2xl font-black text-gold-200"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                  >
                    {activeContent.title}
                  </p>
                  <p className="text-xs md:text-sm text-gold-300/70 font-semibold">{activeContent.subtitle}</p>
                </div>
              </div>
              <p
                className="font-display text-sm md:text-base text-gold-100/80 leading-relaxed mt-2"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              >
                {activeContent.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===== Navigation hint + buttons ===== */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {revealStep > 0 && (
            <button
              onClick={onPrev}
              className="px-4 py-2 rounded-full bg-stone-800/80 text-gold-300 text-sm font-bold border border-gold-700/30 hover:bg-stone-700/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              ← السابق
            </button>
          )}
          <p className="text-xs md:text-sm text-gold-300/40 font-semibold">
            {allRevealed ? 'اضغط المحطة للدخول' : 'كشف المحطة التالية'}
          </p>
          {!allRevealed && (
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-full bg-gold-500/80 text-stone-900 text-sm font-bold hover:bg-gold-400/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-gold-300"
            >
              التالي →
            </button>
          )}
        </div>
      </div>

      {/* ===== Action buttons (outside dark container) ===== */}
      {allRevealed && completedStations.length === 0 && (
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={onStartJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-l from-royal-500 to-royal-700 text-white font-display text-2xl font-black shadow-xl hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-gold-400"
          >
            <MapPin className="w-7 h-7" />
            ابدأ الرحلة
          </motion.button>
        </div>
      )}

      {allRevealed && completedStations.length > 0 && !finalUnlocked && (
        <p className="text-center mt-4 font-display text-lg font-bold text-royal-700">
          أكمل باقي المحطات لتفتح التحدي النهائي! 🏆
        </p>
      )}

      {allRevealed && finalUnlocked && (
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={onFinalChallenge}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-display text-2xl font-black shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
          >
            <MapPin className="w-7 h-7" />
            ابدأ التحدي النهائي 🏆
          </motion.button>
        </div>
      )}

      {/* ===== Locked station message ===== */}
      <AnimatePresence>
        {lockedMessage !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl px-6 py-4 shadow-2xl border-4 border-clay-400 text-center max-w-xs"
          >
            <div className="text-4xl mb-2">🔒</div>
            <p className="font-display text-lg font-bold text-royal-800 mb-1">المحطة دي لسه مقفولة.</p>
            <p className="text-sm text-royal-600">كمّل المحطة السابقة عشان تفتحها!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
