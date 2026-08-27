import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { stations } from '@/data/stations';

interface OpeningExperienceProps {
  /** Called when the video finishes (video mode) or when the start button is pressed (journey mode) */
  onComplete: () => void;
  /** 'video' = cinematic opening video; 'journey' = presenter-controlled intro */
  mode: 'video' | 'journey';
  /** Current step index for journey mode (controlled by parent keyboard handler) */
  manualStep?: number;
}

type Phase = 'video' | 'journey';

const JOURNEY_INTRO_STEPS: { text: string; stationIndex: number | null }[] = [
  { text: 'في رحلتنا هنمشي مع باروخ خطوة بخطوة.', stationIndex: null },
  { text: 'هنبدأ برسالة...', stationIndex: 0 },
  { text: 'وبعدين هنكتشف أهمية الاعتراف...', stationIndex: 1 },
  { text: 'وهنتعلم إزاي نصلي ونطلب رحمة ربنا...', stationIndex: 2 },
  { text: 'وبعدين هنبحث عن الحكمة الحقيقية...', stationIndex: 3 },
  { text: 'وهنتعرف على أورشليم وهي حزينة على أولادها...', stationIndex: 4 },
  { text: 'وبعد الحزن هنشوف الرجاء والمجد...', stationIndex: 5 },
  { text: 'وفي آخر الرحلة هنكتشف الحقيقة عن الأصنام...', stationIndex: 6 },
  { text: 'وفي النهاية...\nعندنا تحدي كبير!', stationIndex: null },
];

const VIDEO_SRC = '/videos/opening.mp4';

export function OpeningExperience({
  onComplete,
  mode,
  manualStep = 0,
}: OpeningExperienceProps) {
  const [phase, setPhase] = useState<Phase>(mode);
  const [journeyStep, setJourneyStep] = useState(0);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- Video phase: fully automatic, no controls ---
  useEffect(() => {
    if (phase !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setTimeout(() => onComplete(), 800);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [phase, onComplete]);

  // --- Journey phase: sync local step with parent-controlled index ---
  useEffect(() => {
    if (phase !== 'journey') return;
    setJourneyStep(manualStep);
    if (manualStep >= JOURNEY_INTRO_STEPS.length) {
      setShowFinalButton(true);
    } else {
      setShowFinalButton(false);
    }
  }, [manualStep, phase]);

  // --- Video Phase: fully automatic, no UI controls ---
  if (phase === 'video') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      >
        <video

          src="/videos/opening.mp4"
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
    );
  }

  // --- Journey Map Phase (cinematic ancient biblical adventure map) ---
  const currentJourneyStep =
    journeyStep >= 0 && journeyStep < JOURNEY_INTRO_STEPS.length
      ? JOURNEY_INTRO_STEPS[journeyStep]
      : null;
  const activeStationIndex = currentJourneyStep?.stationIndex ?? null;

  const getStationState = (index: number): 'locked' | 'past' | 'active' => {
    if (activeStationIndex != null) {
      if (index === activeStationIndex) return 'active';
      if (index < activeStationIndex) return 'past';
      return 'locked';
    }
    return journeyStep >= JOURNEY_INTRO_STEPS.length - 1 ? 'past' : 'locked';
  };

  const finalActive =
    journeyStep >= JOURNEY_INTRO_STEPS.length - 1 && activeStationIndex == null;

  const isPathDrawn = (i: number) => {
    const next = getStationState(i + 1);
    return next === 'past' || next === 'active';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-stone-950 via-amber-950/40 to-stone-950">
      {/* Vignette for projector contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Floating dust motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
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
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <h1
          className="font-display text-3xl md:text-5xl font-black text-gold-400 mb-1"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
        >
          📜 رحلة باروخ
        </h1>
        <p className="font-display text-lg md:text-2xl font-bold text-gold-200/80">
          من الحزن إلى الرجاء
        </p>
      </motion.div>

      {/* Map area */}
      <div className="absolute inset-0 flex items-center justify-center pt-24 pb-36 px-4">
        <div className="relative w-full max-w-5xl h-full">
          {/* Decorative border frame */}
          <div className="absolute inset-0 rounded-3xl border-2 border-gold-700/20 pointer-events-none" />

          {/* Corner ornaments */}
          {[
            { pos: 'top-0 left-0', rotate: 0 },
            { pos: 'top-0 right-0', rotate: 90 },
            { pos: 'bottom-0 right-0', rotate: 180 },
            { pos: 'bottom-0 left-0', rotate: 270 },
          ].map((corner, i) => (
            <div
              key={i}
              className={`absolute ${corner.pos} w-10 h-10 md:w-14 md:h-14 pointer-events-none`}
              style={{ transform: `rotate(${corner.rotate}deg)` }}
            >
              <svg viewBox="0 0 56 56" className="w-full h-full text-gold-600/25">
                <path d="M0 28 Q0 0 28 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 28 Q8 8 28 8" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="4" cy="4" r="2" fill="currentColor" />
              </svg>
            </div>
          ))}

          {/* Compass rose */}
          <div className="absolute bottom-3 left-3 w-12 h-12 md:w-16 md:h-16 opacity-15 pointer-events-none">
            <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M32 4 L36 32 L32 60 L28 32 Z" fill="currentColor" opacity="0.6" />
              <path d="M4 32 L32 28 L60 32 L32 36 Z" fill="currentColor" opacity="0.3" />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Spotlight on active station */}
          {activeStationIndex != null && (
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out rounded-full"
              style={{
                left: `${stations[activeStationIndex].mapPosition.x}%`,
                top: `${stations[activeStationIndex].mapPosition.y}%`,
                width: '280px',
                height: '280px',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
              }}
            />
          )}

          {/* SVG path connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path to final challenge (from last station to center top) */}
            <motion.line
              x1={stations[6].mapPosition.x}
              y1={stations[6].mapPosition.y}
              x2={50}
              y2={10}
              stroke="#fbbf24"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="1.5 1"
              filter="url(#pathGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: finalActive ? 1 : 0,
                opacity: finalActive ? 0.7 : 0,
              }}
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
                  filter="url(#pathGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: drawn ? 1 : 0,
                    opacity: drawn ? 0.7 : 0,
                    strokeDashoffset: drawn ? [0, -2.5] : 0,
                  }}
                  transition={{
                    pathLength: { duration: 0.8, ease: 'easeInOut' },
                    opacity: { duration: 0.3 },
                    strokeDashoffset: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }}
                />
              );
            })}
          </svg>

          {/* Station markers */}
          <div className="relative w-full h-full">
            {stations.map((s, i) => {
              const state = getStationState(i);
              const isActive = state === 'active';
              const isPast = state === 'past';
              const isLocked = state === 'locked';

              return (
                <motion.div
                  key={s.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{
                    left: `${s.mapPosition.x}%`,
                    top: `${s.mapPosition.y}%`,
                  }}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    opacity: isLocked ? 0.3 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {/* Active glow rings */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute rounded-full bg-gold-400/20"
                        style={{ width: '160%', height: '160%' }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.4, 0, 0.4],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-gold-400/10"
                        style={{ width: '200%', height: '200%' }}
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.2, 0, 0.2],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: 0.3,
                        }}
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
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: ri * 0.15,
                          }}
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
                      <span
                        className={
                          isActive
                            ? 'text-4xl md:text-5xl'
                            : 'text-2xl md:text-3xl'
                        }
                      >
                        {s.icon}
                      </span>
                    )}

                    {/* Past check mark */}
                    {isPast && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-sage-500 flex items-center justify-center border-2 border-white shadow-md">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
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
                      <p className="text-[10px] md:text-xs text-gold-300/80 font-semibold">
                        {s.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Final challenge marker */}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: '50%', top: '10%' }}
              animate={{
                scale: finalActive ? 1.15 : 1,
                opacity: finalActive ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
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
                    finalActive
                      ? 'text-gold-200 text-sm md:text-base'
                      : 'text-stone-500 text-[10px] md:text-xs'
                  }`}
                >
                  التحدي النهائي
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Narration banner */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <AnimatePresence mode="wait">
          {currentJourneyStep && (
            <motion.div
              key={journeyStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-stone-900/80 backdrop-blur-md rounded-2xl border border-gold-700/30 px-6 py-4 md:px-8 md:py-5 text-center shadow-2xl"
            >
              <p
                className="font-display text-xl md:text-2xl font-bold text-gold-200 whitespace-pre-line"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                {currentJourneyStep.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Start button — appears when all steps done */}
      <AnimatePresence>
        {showFinalButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-display text-2xl md:text-3xl font-black shadow-2xl hover:shadow-gold-400/50 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
            >
              🚀 ابدأ الرحلة
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {!showFinalButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <p className="text-sm text-gold-300/40 font-semibold">
            ← السابق | التالي →
          </p>
        </motion.div>
      )}
    </div>
  );
}

export { JOURNEY_INTRO_STEPS };
