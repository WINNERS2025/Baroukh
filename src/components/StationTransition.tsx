import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';

interface StationTransitionProps {
  fromStation: number;
  toStation: number;
  onComplete: () => void;
  play?: (type: 'transition') => void;
}

/* ── Phase definitions ── */
type Phase = 'depart' | 'journey' | 'arrive' | 'waiting';

interface TransitionConfig {
  /** Story label shown during the journey */
  label: string;
  /** Departure scene background */
  departBg: string;
  /** Journey scene background (the transformative middle) */
  journeyBg: string;
  /** Arrival scene background */
  arriveBg: string;
  /** Text color for labels */
  textColor: string;
  /** Which cinematic scene to render */
  scene: 'scroll-to-mirror' | 'mirror-to-night' | 'night-to-book' | 'book-to-jerusalem' | 'jerusalem-to-sunrise' | 'glory-to-temple' | 'temple-to-final';
}

const configs: Record<number, TransitionConfig> = {
  1: {
    label: 'من الرسالة إلى الاعتراف',
    departBg: 'linear-gradient(160deg, #d9a94e, #c08838)',
    journeyBg: 'linear-gradient(160deg, #c08838, #7a5530, #4a3850)',
    arriveBg: 'linear-gradient(160deg, #4a3850, #2a2a3e, #1e1e30)',
    textColor: 'text-amber-50',
    scene: 'scroll-to-mirror',
  },
  2: {
    label: 'من الاعتراف إلى الصلاة',
    departBg: 'linear-gradient(160deg, #1e1e30, #2a2a3e)',
    journeyBg: 'linear-gradient(160deg, #2a2a3e, #1a1a4e, #0a0a2e)',
    arriveBg: 'linear-gradient(160deg, #0a0a2e, #0d1035, #121845)',
    textColor: 'text-amber-50',
    scene: 'mirror-to-night',
  },
  3: {
    label: 'من الصلاة إلى الحكمة',
    departBg: 'linear-gradient(160deg, #0d1035, #121845)',
    journeyBg: 'linear-gradient(160deg, #121845, #2a1e4e, #3a2818)',
    arriveBg: 'linear-gradient(160deg, #3a2818, #2d1b0e, #4a3020)',
    textColor: 'text-amber-50',
    scene: 'night-to-book',
  },
  4: {
    label: 'من الحكمة إلى أورشليم',
    departBg: 'linear-gradient(160deg, #2d1b0e, #4a3020)',
    journeyBg: 'linear-gradient(160deg, #4a3020, #506070, #5b6470)',
    arriveBg: 'linear-gradient(160deg, #5b6470, #4a5260, #3d4450)',
    textColor: 'text-slate-100',
    scene: 'book-to-jerusalem',
  },
  5: {
    label: 'من الحزن إلى المجد',
    departBg: 'linear-gradient(160deg, #3d4450, #4a5260)',
    journeyBg: 'linear-gradient(160deg, #4a5260, #6b4e1a, #d4a040)',
    arriveBg: 'linear-gradient(160deg, #d4a040, #f0c060, #fde58c)',
    textColor: 'text-amber-950',
    scene: 'jerusalem-to-sunrise',
  },
  6: {
    label: 'من المجد إلى الأصنام',
    departBg: 'linear-gradient(160deg, #f0c060, #d4a040)',
    journeyBg: 'linear-gradient(160deg, #d4a040, #6b5040, #3a3025, #2a2520)',
    arriveBg: 'linear-gradient(160deg, #2a2520, #1e1c18, #1a1a1a)',
    textColor: 'text-stone-200',
    scene: 'glory-to-temple',
  },
  7: {
    label: 'إلى التحدي النهائي',
    departBg: 'linear-gradient(160deg, #1a1a1a, #2a2520)',
    journeyBg: 'linear-gradient(160deg, #2a2520, #6b5040, #cdaa4e)',
    arriveBg: 'linear-gradient(160deg, #cdaa4e, #fde58c, #fffbeb)',
    textColor: 'text-amber-950',
    scene: 'temple-to-final',
  },
};

/* ── Cinematic Scene Components ── */

function ScrollToMirrorScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Phase 1: Scroll unrolling */}
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Warm light from scroll */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,210,120,0.4), transparent 70%)' }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: -30, rotate: -5 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-7xl md:text-8xl relative z-10"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(180,120,40,0.5))' }}
          >
            📜
          </motion.div>
          {/* Floating golden particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{ left: `${50 + (Math.cos(i / 12 * Math.PI * 2) * 20)}%`, top: `${50 + (Math.sin(i / 12 * Math.PI * 2) * 20)}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -60 - i * 5 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Phase 2: Transition - scroll dissolves into shimmer, mirror forms */}
      {phase === 'journey' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Darkening veil */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.4) 80%)' }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 2 }}
          />
          {/* Shimmer particles converging */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const startR = 250;
            return (
              <motion.div
                key={i}
                className="absolute text-sm"
                style={{ left: '50%', top: '50%' }}
                initial={{ x: Math.cos(angle) * startR, y: Math.sin(angle) * startR, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [1, 0.3, 0] }}
                transition={{ duration: 1.8, delay: i * 0.04, ease: 'easeIn' }}
              >
                💫
              </motion.div>
            );
          })}
          {/* Mirror forming from particles */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.8, type: 'spring', stiffness: 80 }}
            className="text-6xl md:text-7xl relative z-10"
            style={{ filter: 'drop-shadow(0 0 20px rgba(200,200,230,0.4))' }}
          >
            🪞
          </motion.div>
        </motion.div>
      )}

      {/* Phase 3: Mirror arrives in dark reflective space */}
      {phase === 'arrive' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(180,180,220,0.3))' }}
          >
            🪞
          </motion.div>
          {/* Soft reflection shimmer */}
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(180,180,220,0.15), transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      )}
    </div>
  );
}

function MirrorToNightScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl md:text-8xl"
          >
            🪞
          </motion.div>
          {/* Mirror cracks/shatters effect */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: '50%', top: '50%', width: 2, height: 80 + i * 20 }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.6, 0], scaleY: [0, 1, 1], rotate: (i * 45) + 15 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            >
              <div className="w-full h-full bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
          {/* Dark sky opening up */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 2 }}
          />
          {/* Stars appearing one by one */}
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              style={{
                left: `${(i * 37 + 13) % 95 + 2}%`,
                top: `${(i * 53 + 7) % 80 + 5}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0.8], scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              ⭐
            </motion.div>
          ))}
          {/* Moon rising */}
          <motion.div
            className="absolute text-5xl"
            style={{ left: '70%', top: '50%' }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -40, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5, type: 'spring', stiffness: 50 }}
          >
            🌙
          </motion.div>
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Twinkling stars */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${(i * 37 + 13) % 90 + 5}%`, top: `${(i * 53 + 7) % 70 + 10}%` }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + i * 0.1, repeat: Infinity, delay: i * 0.2 }}
            >
              ⭐
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(200,210,255,0.4))' }}
          >
            🙏
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function NightToBookScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Stars fading, a single bright star descends */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${(i * 37 + 13) % 90 + 5}%`, top: `${(i * 53 + 7) % 60 + 10}%` }}
              animate={{ opacity: [1, 0], scale: [1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.1 }}
            >
              ⭐
            </motion.div>
          ))}
          <motion.div
            animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
            transition={{ duration: 2 }}
            className="text-7xl md:text-8xl"
          >
            🙏
          </motion.div>
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          {/* Star transforms into a glowing key/book shape */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: 360 }}
            transition={{ duration: 2, type: 'spring', stiffness: 60 }}
            className="text-6xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(220,180,100,0.5))' }}
          >
            ✨
          </motion.div>
          {/* Warm light growing — wisdom lamp */}
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,180,100,0.2), transparent 70%)' }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.6, 0.8] }}
            transition={{ duration: 2.5 }}
          />
          {/* Wisdom particles - letters/symbols floating up */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${40 + i * 3}%`, bottom: '30%' }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -80 - i * 10 }}
              transition={{ duration: 2, delay: i * 0.15 }}
            >
              📖
            </motion.div>
          ))}
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(220,180,100,0.4))' }}
          >
            🧠
          </motion.div>
          {/* Warm lamp glow */}
          <motion.div
            className="absolute w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,180,100,0.2), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      )}
    </div>
  );
}

function BookToJerusalemScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 0.9, 1], rotate: [0, -3, 0] }}
            transition={{ duration: 2 }}
            className="text-7xl md:text-8xl"
          >
            🧠
          </motion.div>
          {/* Book pages flying out */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{ left: '50%', top: '50%' }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: (Math.cos(i / 8 * Math.PI * 2) * 150),
                y: (Math.sin(i / 8 * Math.PI * 2) * 100) - 50,
                opacity: [0, 1, 0],
                rotate: 360,
              }}
              transition={{ duration: 2, delay: i * 0.1 }}
            >
              📜
            </motion.div>
          ))}
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
          {/* Clouds/mist rolling in */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-20 w-full"
              style={{
                top: `${20 + i * 15}%`,
                background: 'linear-gradient(90deg, transparent, rgba(180,185,195,0.15), transparent)',
              }}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 300, opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
          {/* City silhouette forming in the mist */}
          <motion.div
            className="absolute bottom-0 left-0 w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: [0, 0.4, 0.6], y: [50, 0, 0] }}
            transition={{ duration: 2.5, delay: 0.5 }}
          >
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-32">
              <g fill="rgba(50,55,65,0.5)">
                <rect x="100" y="80" width="80" height="120" />
                <rect x="200" y="60" width="100" height="140" />
                <rect x="320" y="90" width="70" height="110" />
                <rect x="420" y="50" width="90" height="150" />
                <rect x="540" y="70" width="80" height="130" />
                <rect x="650" y="40" width="100" height="160" />
                <rect x="780" y="65" width="85" height="135" />
                <rect x="890" y="85" width="70" height="115" />
                <rect x="990" y="55" width="90" height="145" />
                <rect x="1100" y="75" width="75" height="125" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(80,90,110,0.4))' }}
          >
            🏙️
          </motion.div>
          {/* Drifting autumn leaves */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-base"
              style={{ left: `${15 + i * 14}%`, top: '20%' }}
              animate={{ y: [0, 200, 400], x: [0, 30, -20], rotate: 360, opacity: [0.4, 0.3, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            >
              🍂
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function JerusalemToSunriseScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Dark Jerusalem silhouette */}
          <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute bottom-0 w-full h-40">
            <g fill="rgba(40,45,55,0.5)">
              <rect x="100" y="100" width="80" height="200" />
              <rect x="200" y="80" width="100" height="220" />
              <rect x="320" y="110" width="70" height="190" />
              <rect x="420" y="70" width="90" height="230" />
              <rect x="540" y="90" width="80" height="210" />
              <rect x="650" y="60" width="100" height="240" />
              <rect x="780" y="85" width="85" height="215" />
              <rect x="890" y="105" width="70" height="195" />
              <rect x="990" y="75" width="90" height="225" />
              <rect x="1100" y="95" width="75" height="205" />
            </g>
          </svg>
          <motion.div
            animate={{ scale: [1, 0.95, 1] }}
            transition={{ duration: 2 }}
            className="text-7xl md:text-8xl relative z-10"
          >
            🏙️
          </motion.div>
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
          {/* Dawn breaking — light from bottom */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(255,200,80,0.3), transparent 60%)' }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 2 }}
          />
          {/* Sun rising */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: '50%', bottom: '20%', width: 80, height: 80,
              transform: 'translateX(-50%)',
              background: 'radial-gradient(circle, rgba(255,220,120,0.8), rgba(255,180,60,0.4), transparent 70%)',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -40, opacity: 1 }}
            transition={{ duration: 2.5, type: 'spring', stiffness: 50 }}
          />
          {/* Light rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%', bottom: '25%', width: 3, height: 200,
                transformOrigin: 'bottom center',
                transform: `rotate(${i * 45}deg)`,
                background: 'linear-gradient(to top, rgba(255,210,100,0.15), transparent)',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.6, 0.3], scaleY: [0, 1, 1] }}
              transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
            />
          ))}
          {/* Golden particles rising */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${30 + i * 4}%`, bottom: '20%' }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -150 - i * 8, scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, delay: i * 0.1 }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          {/* Golden glow */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,210,100,0.3), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,200,80,0.6))' }}
          >
            👑
          </motion.div>
          {/* Sparkles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: Math.cos(i / 8 * Math.PI * 2) * 80,
                y: Math.sin(i / 8 * Math.PI * 2) * 80,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function GloryToTempleScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 0.9, 1], y: [0, -10, 0] }}
            transition={{ duration: 2 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,200,80,0.5))' }}
          >
            👑
          </motion.div>
          {/* Golden light fading */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,200,80,0.2), transparent 70%)' }}
            animate={{ opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 2.5 }}
          />
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
          {/* Darkness creeping in from edges */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,8,5,0.7) 90%)' }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 2.5 }}
          />
          {/* Fog rolling in */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-24 w-full"
              style={{
                top: `${30 + i * 20}%`,
                background: 'linear-gradient(90deg, transparent, rgba(30,25,20,0.2), transparent)',
              }}
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 400, opacity: [0, 0.5, 0] }}
              transition={{ duration: 4, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
          {/* Temple columns emerging from darkness */}
          <motion.div
            className="absolute bottom-0 left-0 w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: [0, 0.5, 0.7], y: [60, 0, 0] }}
            transition={{ duration: 2.5, delay: 0.5 }}
          >
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-40">
              <g fill="rgba(25,20,15,0.6)">
                <rect x="100" y="60" width="50" height="240" />
                <rect x="250" y="40" width="55" height="260" />
                <rect x="400" y="30" width="60" height="270" />
                <rect x="560" y="50" width="55" height="250" />
                <rect x="700" y="30" width="60" height="270" />
                <rect x="850" y="40" width="55" height="260" />
                <rect x="1000" y="55" width="50" height="245" />
              </g>
              {/* Lintel */}
              <rect x="80" y="20" width="1080" height="30" fill="rgba(20,16,10,0.6)" />
            </svg>
          </motion.div>
          {/* Glowing idol eyes in the dark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="absolute"
            style={{ left: '48%', top: '45%' }}
          >
            <div className="flex gap-3">
              <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-red-500/60" />
              <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-red-500/60" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 80 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 15px rgba(200,100,50,0.3))' }}
          >
            🗿
          </motion.div>
          {/* Fog at bottom */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-16 w-full"
              style={{ bottom: `${i * 8}%`, background: 'linear-gradient(90deg, transparent, rgba(30,25,20,0.15), transparent)' }}
              animate={{ x: [-200, 200], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function TempleToFinalScene({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {phase === 'depart' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2 }}
            className="text-7xl md:text-8xl"
          >
            🗿
          </motion.div>
          {/* Idol cracking/breaking */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: '50%', top: '50%', width: 1, height: 60 + i * 15 }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1, 1], rotate: i * 60 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            >
              <div className="w-full h-full bg-gradient-to-b from-transparent via-amber-200/50 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {phase === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
          {/* Light breaking through darkness */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,210,100,0.3), transparent 60%)' }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 2.5 }}
          />
          {/* Golden particles converging into a trophy/star */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            return (
              <motion.div
                key={i}
                className="absolute text-sm"
                style={{ left: '50%', top: '50%' }}
                initial={{ x: Math.cos(angle) * 200, y: Math.sin(angle) * 200, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [1, 0.3, 0] }}
                transition={{ duration: 2, delay: i * 0.05, ease: 'easeIn' }}
              >
                ✨
              </motion.div>
            );
          })}
          {/* Light rays */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%', top: '50%', width: 4, height: 250,
                transformOrigin: 'center',
                transform: `rotate(${i * 60}deg)`,
                background: 'linear-gradient(to top, rgba(255,210,100,0.2), transparent)',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.5], scaleY: [0, 1] }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </motion.div>
      )}

      {phase === 'arrive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 150 }}
            className="text-7xl md:text-8xl"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,210,100,0.6))' }}
          >
            🏆
          </motion.div>
          {/* Celebration sparkles */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: Math.cos(i / 10 * Math.PI * 2) * 100,
                y: Math.sin(i / 10 * Math.PI * 2) * 100,
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            >
              🎉
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ── Scene renderer ── */
function SceneRenderer({ scene, phase }: { scene: TransitionConfig['scene']; phase: Phase }) {
  switch (scene) {
    case 'scroll-to-mirror': return <ScrollToMirrorScene phase={phase} />;
    case 'mirror-to-night': return <MirrorToNightScene phase={phase} />;
    case 'night-to-book': return <NightToBookScene phase={phase} />;
    case 'book-to-jerusalem': return <BookToJerusalemScene phase={phase} />;
    case 'jerusalem-to-sunrise': return <JerusalemToSunriseScene phase={phase} />;
    case 'glory-to-temple': return <GloryToTempleScene phase={phase} />;
    case 'temple-to-final': return <TempleToFinalScene phase={phase} />;
    default: return null;
  }
}

/* ── Main component ── */
export function StationTransition({ fromStation, toStation, onComplete, play }: StationTransitionProps) {
  const config = configs[fromStation] ?? configs[1];
  const [phase, setPhase] = useState<Phase>('depart');

  // Play transition sound on mount
  useEffect(() => {
    play?.('transition');
  }, [play]);

  // Advance through phases
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('journey'), 2600));
    timers.push(setTimeout(() => setPhase('arrive'), 5200));
    timers.push(setTimeout(() => setPhase('waiting'), 6800));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Background morphs through phases
  const bg = useMemo(() => {
    if (phase === 'depart') return config.departBg;
    if (phase === 'journey') return config.journeyBg;
    return config.arriveBg;
  }, [phase, config]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center"
      style={{ background: bg, transition: 'background 1.5s ease-in-out' }}
    >
      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-black z-20"
        initial={{ height: 0 }}
        animate={{ height: 60 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-black z-20"
        initial={{ height: 0 }}
        animate={{ height: 60 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Scene */}
      <SceneRenderer scene={config.scene} phase={phase} />

      {/* Story label */}
      <div className="absolute z-30 px-4" style={{ bottom: 90 }}>
        <AnimatePresence mode="wait">
          {phase !== 'depart' && (
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className={`font-display text-xl md:text-2xl font-bold ${config.textColor} text-center`}
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
            >
              {config.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* "Press to continue" prompt — only after cinematic completes */}
      <AnimatePresence>
        {phase === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
            style={{ bottom: 100 }}
          >
            <span className="text-sm font-semibold text-white">اضغط للمتابعة</span>
            <ChevronRight className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">/ مسافة</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
