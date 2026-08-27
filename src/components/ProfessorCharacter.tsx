import { motion } from 'framer-motion';

interface ProfessorCharacterProps {
  stationId: number;
  pose?: 'point' | 'hold-scroll' | 'hold-book' | 'look-ahead' | 'welcome';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { w: 70, h: 110 },
  md: { w: 100, h: 160 },
  lg: { w: 140, h: 220 },
};

export function ProfessorCharacter({ stationId, pose = 'look-ahead', size = 'md' }: ProfessorCharacterProps) {
  const dim = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
      className="flex flex-col items-center pointer-events-none select-none"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: dim.w, height: dim.h }}
        className="relative"
      >
        <ProfessorSVG pose={pose} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[9px] font-bold text-current/60 mt-0.5"
      >
        الأستاذ
      </motion.p>
    </motion.div>
  );
}

/* ── SVG Professor ── */
function ProfessorSVG({ pose }: { pose: string }) {
  // Color palette
  const robe = '#3a3550';
  const robeDark = '#2a2540';
  const skin = '#e8c39e';
  const skinShadow = '#d4a878';
  const beard = '#d8d8d8';
  const hat = '#2a2540';
  const hatBand = '#cdaa4e';
  const scroll = '#f5e6c8';
  const scrollEdge = '#c9a96e';
  const book = '#8b4513';
  const bookCover = '#6b3410';

  // Arm positions vary by pose
  const leftArm = pose === 'point' ? 'M58,70 Q50,85 48,100' : pose === 'hold-scroll' ? 'M58,70 Q52,82 50,92' : pose === 'hold-book' ? 'M58,70 Q52,82 50,92' : pose === 'welcome' ? 'M58,70 Q45,75 38,68' : 'M58,72 Q55,85 53,98';
  const rightArm = pose === 'point' ? 'M82,70 Q95,72 108,68' : pose === 'hold-scroll' ? 'M82,70 Q88,82 90,92' : pose === 'hold-book' ? 'M82,70 Q88,82 90,92' : pose === 'welcome' ? 'M82,70 Q95,75 102,68' : 'M82,72 Q85,85 87,98';

  return (
    <svg viewBox="0 0 140 160" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}>
      {/* Shadow ellipse on ground */}
      <ellipse cx="70" cy="155" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* Robe / body */}
      <path d="M70,45 L55,55 L48,70 L45,150 L95,150 L92,70 L85,55 L70,45 Z" fill={robe} />
      {/* Robe shading */}
      <path d="M70,55 L70,150 L95,150 L92,70 L85,55 L70,55 Z" fill={robeDark} opacity="0.4" />
      {/* Robe trim */}
      <path d="M45,150 L95,150" stroke={hatBand} strokeWidth="2" fill="none" opacity="0.6" />

      {/* Arms */}
      <path d={leftArm} stroke={robe} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={rightArm} stroke={robe} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <circle cx={pose === 'point' ? 48 : pose === 'hold-scroll' ? 50 : pose === 'hold-book' ? 50 : pose === 'welcome' ? 38 : 53} cy={pose === 'point' ? 100 : pose === 'hold-scroll' ? 92 : pose === 'hold-book' ? 92 : pose === 'welcome' ? 68 : 98} r="5" fill={skin} />

      <circle cx={pose === 'point' ? 108 : pose === 'hold-scroll' ? 90 : pose === 'hold-book' ? 90 : pose === 'welcome' ? 102 : 87} cy={pose === 'point' ? 68 : pose === 'hold-scroll' ? 92 : pose === 'hold-book' ? 92 : pose === 'welcome' ? 68 : 98} r="5" fill={skin} />

      {/* Head */}
      <circle cx="70" cy="32" r="16" fill={skin} />
      {/* Face shadow */}
      <path d="M70,16 a16,16 0 0 1 0,32 a12,16 0 0 0 0,-32 Z" fill={skinShadow} opacity="0.3" />

      {/* Hat - scholar cap */}
      <path d="M52,22 Q70,8 88,22 L88,28 Q70,18 52,28 Z" fill={hat} />
      <rect x="52" y="26" width="36" height="3" rx="1" fill={hatBand} />

      {/* Eyes - simple dots, looking direction varies */}
      {pose === 'point' ? (
        <>
          <circle cx="76" cy="30" r="2" fill="#2a2540" />
          <circle cx="78" cy="29" r="0.8" fill="#fff" opacity="0.6" />
        </>
      ) : pose === 'look-ahead' ? (
        <>
          <circle cx="65" cy="30" r="2" fill="#2a2540" />
          <circle cx="75" cy="30" r="2" fill="#2a2540" />
        </>
      ) : (
        <>
          <circle cx="65" cy="30" r="2" fill="#2a2540" />
          <circle cx="75" cy="30" r="2" fill="#2a2540" />
        </>
      )}

      {/* Beard */}
      <path d="M62,36 Q70,42 78,36 Q76,48 70,50 Q64,48 62,36 Z" fill={beard} />
      <path d="M64,38 Q70,43 76,38 Q74,46 70,48 Q66,46 64,38 Z" fill="#c8c8c8" opacity="0.5" />

      {/* Pose-specific props */}
      {pose === 'hold-scroll' && (
        <g>
          {/* Scroll */}
          <rect x="46" y="88" width="48" height="12" rx="2" fill={scroll} />
          <rect x="44" y="86" width="6" height="16" rx="3" fill={scrollEdge} />
          <rect x="90" y="86" width="6" height="16" rx="3" fill={scrollEdge} />
          {/* Text lines */}
          <line x1="54" y1="92" x2="86" y2="92" stroke={scrollEdge} strokeWidth="0.8" opacity="0.5" />
          <line x1="54" y1="95" x2="80" y2="95" stroke={scrollEdge} strokeWidth="0.8" opacity="0.5" />
        </g>
      )}

      {pose === 'hold-book' && (
        <g>
          {/* Book */}
          <rect x="50" y="86" width="40" height="14" rx="1" fill={book} />
          <rect x="50" y="86" width="40" height="3" fill={bookCover} />
          <line x1="70" y1="86" x2="70" y2="100" stroke={bookCover} strokeWidth="1" />
          {/* Bookmark */}
          <rect x="82" y="86" width="3" height="18" fill="#cdaa4e" />
        </g>
      )}

      {pose === 'point' && (
        <g>
          {/* Pointing finger indicator */}
          <motion.g
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <circle cx="112" cy="66" r="3" fill="#cdaa4e" opacity="0.5" />
          </motion.g>
        </g>
      )}

      {pose === 'welcome' && (
        <g>
          {/* Small sparkles near raised hands */}
          <motion.circle cx="35" cy="64" r="2" fill="#cdaa4e"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="105" cy="64" r="2" fill="#cdaa4e"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        </g>
      )}
    </svg>
  );
}
