import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

interface StationEnvironmentProps {
  stationId: number;
  children: ReactNode;
}

/* ── Per-station floating element config ── */
interface FloatItem {
  emoji: string;
  size: number;
  duration: number;
  drift: number;
  delay: number;
  opacity: number;
}

interface EnvConfig {
  /** CSS gradient string for the base background */
  bg: string;
  /** Text color class for content readability */
  textClass: string;
  /** Whether the environment is dark (affects overlays) */
  dark: boolean;
  /** Floating decorative elements */
  floaters: FloatItem[];
  /** Key for the SVG silhouette layer */
  silhouette: 'city' | 'mirror' | 'night' | 'library' | 'jerusalem-sad' | 'jerusalem-gold' | 'temple';
  /** Atmospheric overlay gradient (radial or linear) */
  atmosphere: string;
  /** Vignette intensity 0-1 */
  vignette: number;
  /** Optional animated light source position */
  lightOrb?: { x: string; y: string; size: number; color: string; pulse: boolean };
}

const envConfigs: Record<number, EnvConfig> = {
  1: {
    bg: 'linear-gradient(180deg, #f5d99a 0%, #e8c074 25%, #d9a94e 55%, #c08838 100%)',
    textClass: 'text-amber-950',
    dark: false,
    silhouette: 'city',
    atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(255,220,130,0.5), transparent 60%)',
    vignette: 0.3,
    lightOrb: { x: '50%', y: '12%', size: 200, color: 'rgba(255,230,150,0.5)', pulse: true },
    floaters: [
      { emoji: '✨', size: 14, duration: 5, drift: 15, delay: 0, opacity: 0.5 },
      { emoji: '✨', size: 10, duration: 7, drift: 20, delay: 1, opacity: 0.4 },
      { emoji: '📜', size: 22, duration: 8, drift: 10, delay: 2, opacity: 0.15 },
      { emoji: '✨', size: 12, duration: 6, drift: 18, delay: 3, opacity: 0.45 },
      { emoji: '☀️', size: 16, duration: 9, drift: 8, delay: 0.5, opacity: 0.2 },
      { emoji: '✨', size: 8, duration: 5.5, drift: 25, delay: 4, opacity: 0.5 },
    ],
  },
  2: {
    bg: 'linear-gradient(180deg, #2a2a3e 0%, #252538 40%, #1e1e30 70%, #1a1a28 100%)',
    textClass: 'text-amber-50',
    dark: true,
    silhouette: 'mirror',
    atmosphere: 'radial-gradient(ellipse at 50% 45%, rgba(180,180,220,0.12), transparent 55%)',
    vignette: 0.6,
    floaters: [
      { emoji: '💧', size: 12, duration: 7, drift: 12, delay: 0, opacity: 0.25 },
      { emoji: '💧', size: 10, duration: 9, drift: 15, delay: 2, opacity: 0.2 },
      { emoji: '✨', size: 8, duration: 6, drift: 10, delay: 1, opacity: 0.15 },
      { emoji: '💧', size: 8, duration: 8, drift: 18, delay: 3, opacity: 0.2 },
    ],
  },
  3: {
    bg: 'linear-gradient(180deg, #0a0a2e 0%, #0d1035 30%, #121845 60%, #141b57 100%)',
    textClass: 'text-amber-50',
    dark: true,
    silhouette: 'night',
    atmosphere: 'radial-gradient(ellipse at 65% 20%, rgba(200,210,255,0.15), transparent 50%)',
    vignette: 0.5,
    lightOrb: { x: '72%', y: '18%', size: 120, color: 'rgba(230,235,255,0.4)', pulse: false },
    floaters: [
      { emoji: '⭐', size: 8, duration: 4, drift: 6, delay: 0, opacity: 0.7 },
      { emoji: '⭐', size: 6, duration: 5, drift: 8, delay: 0.5, opacity: 0.6 },
      { emoji: '⭐', size: 10, duration: 6, drift: 5, delay: 1, opacity: 0.8 },
      { emoji: '⭐', size: 7, duration: 4.5, drift: 10, delay: 2, opacity: 0.5 },
      { emoji: '⭐', size: 5, duration: 5.5, drift: 7, delay: 3, opacity: 0.6 },
      { emoji: '✨', size: 8, duration: 7, drift: 12, delay: 1.5, opacity: 0.4 },
      { emoji: '⭐', size: 9, duration: 6.5, drift: 9, delay: 4, opacity: 0.5 },
    ],
  },
  4: {
    bg: 'linear-gradient(180deg, #2d1b0e 0%, #3a2415 25%, #4a3020 55%, #3a2415 100%)',
    textClass: 'text-amber-50',
    dark: true,
    silhouette: 'library',
    atmosphere: 'radial-gradient(ellipse at 50% 30%, rgba(220,180,100,0.15), transparent 60%)',
    vignette: 0.55,
    lightOrb: { x: '50%', y: '25%', size: 160, color: 'rgba(220,180,100,0.3)', pulse: true },
    floaters: [
      { emoji: '📖', size: 16, duration: 8, drift: 8, delay: 0, opacity: 0.12 },
      { emoji: '✨', size: 10, duration: 6, drift: 12, delay: 1, opacity: 0.3 },
      { emoji: '📜', size: 14, duration: 9, drift: 10, delay: 2, opacity: 0.1 },
      { emoji: '✨', size: 8, duration: 5, drift: 15, delay: 3, opacity: 0.35 },
      { emoji: '📖', size: 12, duration: 7, drift: 6, delay: 4, opacity: 0.1 },
    ],
  },
  5: {
    bg: 'linear-gradient(180deg, #6b7280 0%, #5b6470 30%, #4a5260 60%, #3d4450 100%)',
    textClass: 'text-slate-100',
    dark: true,
    silhouette: 'jerusalem-sad',
    atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(180,185,195,0.15), transparent 70%)',
    vignette: 0.5,
    floaters: [
      { emoji: '🍂', size: 14, duration: 6, drift: 30, delay: 0, opacity: 0.25 },
      { emoji: '🍂', size: 12, duration: 8, drift: 25, delay: 1.5, opacity: 0.2 },
      { emoji: '🍃', size: 10, duration: 7, drift: 35, delay: 3, opacity: 0.2 },
      { emoji: '🍂', size: 11, duration: 9, drift: 28, delay: 0.5, opacity: 0.15 },
    ],
  },
  6: {
    bg: 'linear-gradient(180deg, #1a1535 0%, #2a2050 20%, #6b4e1a 50%, #d4a040 80%, #f0c060 100%)',
    textClass: 'text-amber-950',
    dark: false,
    silhouette: 'jerusalem-gold',
    atmosphere: 'radial-gradient(ellipse at 50% 70%, rgba(255,210,100,0.35), transparent 65%)',
    vignette: 0.2,
    lightOrb: { x: '50%', y: '70%', size: 300, color: 'rgba(255,210,100,0.4)', pulse: true },
    floaters: [
      { emoji: '🌟', size: 14, duration: 5, drift: 12, delay: 0, opacity: 0.5 },
      { emoji: '✨', size: 10, duration: 6, drift: 18, delay: 1, opacity: 0.6 },
      { emoji: '🌟', size: 12, duration: 7, drift: 10, delay: 2, opacity: 0.4 },
      { emoji: '✨', size: 8, duration: 5, drift: 20, delay: 3, opacity: 0.55 },
      { emoji: '⭐', size: 10, duration: 8, drift: 15, delay: 0.5, opacity: 0.35 },
      { emoji: '✨', size: 12, duration: 6.5, drift: 14, delay: 4, opacity: 0.45 },
    ],
  },
  7: {
    bg: 'linear-gradient(180deg, #1a1a1a 0%, #222020 30%, #2a2520 60%, #1e1c18 100%)',
    textClass: 'text-stone-200',
    dark: true,
    silhouette: 'temple',
    atmosphere: 'radial-gradient(ellipse at 30% 40%, rgba(200,100,50,0.08), transparent 55%)',
    vignette: 0.7,
    floaters: [
      { emoji: '🌫️', size: 40, duration: 10, drift: 8, delay: 0, opacity: 0.12 },
      { emoji: '🌫️', size: 35, duration: 12, drift: 12, delay: 2, opacity: 0.1 },
      { emoji: '💨', size: 20, duration: 8, drift: 15, delay: 4, opacity: 0.08 },
      { emoji: '🌫️', size: 30, duration: 11, drift: 10, delay: 1, opacity: 0.1 },
    ],
  },
};

/* ── SVG Silhouette Layers ── */

function CitySilhouette() {
  return (
    <svg className="absolute bottom-0 left-0 w-full" style={{ height: '35%' }} viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden>
      {/* Distant hills */}
      <path d="M0,250 Q200,180 400,210 T800,200 T1200,220 L1200,300 L0,300 Z" fill="rgba(120,80,30,0.3)" />
      {/* Mid buildings */}
      <g fill="rgba(100,65,25,0.5)">
        <rect x="50" y="160" width="80" height="140" />
        <rect x="140" y="140" width="60" height="160" />
        <rect x="210" y="170" width="100" height="130" />
        <rect x="320" y="130" width="70" height="170" />
        <rect x="400" y="155" width="90" height="145" />
        <rect x="500" y="120" width="65" height="180" />
        <rect x="575" y="145" width="80" height="155" />
        <rect x="665" y="135" width="70" height="165" />
        <rect x="745" y="160" width="95" height="140" />
        <rect x="850" y="125" width="60" height="175" />
        <rect x="920" y="150" width="85" height="150" />
        <rect x="1015" y="140" width="70" height="160" />
        <rect x="1095" y="165" width="75" height="135" />
      </g>
      {/* Windows - warm light */}
      <g fill="rgba(255,200,100,0.4)">
        <rect x="65" y="180" width="12" height="15" />
        <rect x="90" y="180" width="12" height="15" />
        <rect x="65" y="210" width="12" height="15" />
        <rect x="155" y="160" width="10" height="12" />
        <rect x="175" y="160" width="10" height="12" />
        <rect x="155" y="190" width="10" height="12" />
        <rect x="340" y="150" width="10" height="12" />
        <rect x="360" y="150" width="10" height="12" />
        <rect x="340" y="180" width="10" height="12" />
        <rect x="520" y="140" width="10" height="12" />
        <rect x="540" y="140" width="10" height="12" />
        <rect x="520" y="170" width="10" height="12" />
        <rect x="680" y="155" width="10" height="12" />
        <rect x="700" y="155" width="10" height="12" />
        <rect x="680" y="185" width="10" height="12" />
        <rect x="865" y="145" width="10" height="12" />
        <rect x="885" y="145" width="10" height="12" />
        <rect x="865" y="175" width="10" height="12" />
        <rect x="1030" y="160" width="10" height="12" />
        <rect x="1050" y="160" width="10" height="12" />
      </g>
      {/* Foreground wall */}
      <rect x="0" y="240" width="1200" height="60" fill="rgba(80,50,15,0.6)" />
      <rect x="0" y="238" width="1200" height="4" fill="rgba(60,35,10,0.7)" />
    </svg>
  );
}

function MirrorSilhouette() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Dark floor */}
      <ellipse cx="600" cy="780" rx="700" ry="40" fill="rgba(10,10,20,0.6)" />
      {/* Mirror frame - ornate */}
      <g transform="translate(600,380)">
        <ellipse cx="0" cy="0" rx="140" ry="200" fill="none" stroke="rgba(180,175,200,0.15)" strokeWidth="8" />
        <ellipse cx="0" cy="0" rx="130" ry="190" fill="rgba(20,20,35,0.6)" />
        {/* Mirror reflection shimmer */}
        <ellipse cx="-20" cy="-40" rx="50" ry="80" fill="rgba(200,200,230,0.06)" />
        <ellipse cx="30" cy="20" rx="30" ry="50" fill="rgba(180,180,210,0.04)" />
        {/* Ornate top */}
        <path d="M-80,-200 Q0,-240 80,-200" fill="none" stroke="rgba(160,155,180,0.2)" strokeWidth="4" />
        <circle cx="0" cy="-210" r="8" fill="rgba(160,155,180,0.15)" />
      </g>
      {/* Floor reflection */}
      <ellipse cx="600" cy="600" rx="180" ry="15" fill="rgba(180,175,200,0.05)" />
      {/* Candles on sides */}
      <g transform="translate(350,520)">
        <rect x="-3" y="0" width="6" height="40" fill="rgba(200,190,170,0.3)" />
        <ellipse cx="0" cy="-5" rx="4" ry="8" fill="rgba(255,200,100,0.4)" />
        <motion.ellipse cx="0" cy="-5" rx="8" ry="14" fill="rgba(255,200,100,0.1)"
          animate={{ opacity: [0.05, 0.15, 0.05], ry: [12, 16, 12] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </g>
      <g transform="translate(850,520)">
        <rect x="-3" y="0" width="6" height="40" fill="rgba(200,190,170,0.3)" />
        <ellipse cx="0" cy="-5" rx="4" ry="8" fill="rgba(255,200,100,0.4)" />
        <motion.ellipse cx="0" cy="-5" rx="8" ry="14" fill="rgba(255,200,100,0.1)"
          animate={{ opacity: [0.05, 0.15, 0.05], ry: [12, 16, 12] }}
          transition={{ duration: 2.3, repeat: Infinity, delay: 0.5 }} />
      </g>
    </svg>
  );
}

function NightSilhouette() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Moon */}
      <g transform="translate(860,160)">
        <circle cx="0" cy="0" r="50" fill="rgba(230,235,255,0.85)" />
        <circle cx="0" cy="0" r="60" fill="rgba(230,235,255,0.15)" />
        <circle cx="0" cy="0" r="75" fill="rgba(230,235,255,0.06)" />
        <circle cx="-12" cy="-8" r="8" fill="rgba(200,205,230,0.5)" />
        <circle cx="15" cy="10" r="6" fill="rgba(200,205,230,0.4)" />
      </g>
      {/* Distant mountains */}
      <path d="M0,500 L150,350 L300,420 L450,320 L600,400 L750,330 L900,410 L1050,360 L1200,440 L1200,800 L0,800 Z"
        fill="rgba(10,15,40,0.5)" />
      {/* Closer hills */}
      <path d="M0,560 Q200,480 400,520 T800,500 T1200,540 L1200,800 L0,800 Z"
        fill="rgba(8,12,35,0.7)" />
      {/* Foreground silhouette - trees/rocks */}
      <g fill="rgba(5,8,25,0.85)">
        <path d="M50,620 Q55,580 60,560 Q65,580 70,620 Z" />
        <path d="M100,630 Q108,570 115,540 Q122,570 130,630 Z" />
        <ellipse cx="200" cy="650" rx="40" ry="20" />
        <path d="M280,615 Q288,560 295,535 Q302,560 310,615 Z" />
        <path d="M330,625 Q338,575 345,555 Q352,575 360,625 Z" />
        <ellipse cx="950" cy="660" rx="50" ry="22" />
        <path d="M1000,620 Q1008,565 1015,540 Q1022,565 1030,620 Z" />
        <path d="M1080,630 Q1088,575 1095,550 Q1102,575 1110,630 Z" />
      </g>
      {/* Ground */}
      <rect x="0" y="640" width="1200" height="160" fill="rgba(5,8,25,0.6)" />
    </svg>
  );
}

function LibrarySilhouette() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Floor */}
      <rect x="0" y="600" width="1200" height="200" fill="rgba(30,18,8,0.6)" />
      {/* Back wall shelves */}
      <g fill="rgba(40,25,12,0.5)">
        <rect x="50" y="150" width="300" height="450" />
        <rect x="400" y="120" width="350" height="480" />
        <rect x="800" y="140" width="320" height="460" />
      </g>
      {/* Shelf horizontal lines */}
      <g stroke="rgba(60,35,15,0.4)" strokeWidth="3" fill="none">
        <line x1="50" y1="240" x2="350" y2="240" />
        <line x1="50" y1="330" x2="350" y2="330" />
        <line x1="50" y1="420" x2="350" y2="420" />
        <line x1="50" y1="510" x2="350" y2="510" />
        <line x1="400" y1="210" x2="750" y2="210" />
        <line x1="400" y1="300" x2="750" y2="300" />
        <line x1="400" y1="390" x2="750" y2="390" />
        <line x1="400" y1="480" x2="750" y2="480" />
        <line x1="400" y1="570" x2="750" y2="570" />
        <line x1="800" y1="230" x2="1120" y2="230" />
        <line x1="800" y1="320" x2="1120" y2="320" />
        <line x1="800" y1="410" x2="1120" y2="410" />
        <line x1="800" y1="500" x2="1120" y2="500" />
      </g>
      {/* Books on shelves - colored spines */}
      <g opacity="0.35">
        {/* Shelf 1 */}
        <rect x="60" y="160" width="14" height="75" fill="#8B4513" /><rect x="78" y="165" width="12" height="70" fill="#6B3410" /><rect x="94" y="160" width="16" height="75" fill="#A0522D" /><rect x="114" y="170" width="10" height="65" fill="#7B3F00" /><rect x="128" y="160" width="14" height="75" fill="#8B6914" /><rect x="146" y="165" width="12" height="70" fill="#704214" /><rect x="162" y="160" width="18" height="75" fill="#8B4513" /><rect x="184" y="168" width="12" height="67" fill="#6B3410" /><rect x="200" y="160" width="14" height="75" fill="#9C661F" /><rect x="218" y="165" width="16" height="70" fill="#7B3F00" /><rect x="238" y="160" width="12" height="75" fill="#8B4513" /><rect x="254" y="170" width="14" height="65" fill="#A0522D" /><rect x="272" y="160" width="16" height="75" fill="#704214" /><rect x="292" y="165" width="12" height="70" fill="#8B6914" /><rect x="308" y="160" width="14" height="75" fill="#6B3410" /><rect x="326" y="168" width="14" height="67" fill="#9C661F" />
        {/* Shelf 2 */}
        <rect x="410" y="130" width="14" height="75" fill="#704214" /><rect x="428" y="135" width="12" height="70" fill="#8B4513" /><rect x="444" y="130" width="16" height="75" fill="#6B3410" /><rect x="464" y="140" width="10" height="65" fill="#A0522D" /><rect x="478" y="130" width="14" height="75" fill="#8B6914" /><rect x="496" y="135" width="16" height="70" fill="#7B3F00" /><rect x="516" y="130" width="12" height="75" fill="#9C661F" /><rect x="532" y="138" width="14" height="67" fill="#8B4513" /><rect x="550" y="130" width="14" height="75" fill="#704214" /><rect x="568" y="135" width="12" height="70" fill="#6B3410" /><rect x="584" y="130" width="18" height="75" fill="#8B6914" /><rect x="606" y="140" width="12" height="65" fill="#A0522D" /><rect x="622" y="130" width="14" height="75" fill="#7B3F00" /><rect x="640" y="135" width="16" height="70" fill="#9C661F" /><rect x="660" y="130" width="12" height="75" fill="#8B4513" /><rect x="676" y="138" width="14" height="67" fill="#704214" /><rect x="694" y="130" width="16" height="75" fill="#6B3410" /><rect x="714" y="135" width="12" height="70" fill="#8B6914" /><rect x="730" y="130" width="14" height="75" fill="#A0522D" />
        {/* Shelf 3 */}
        <rect x="810" y="150" width="14" height="75" fill="#8B4513" /><rect x="828" y="155" width="16" height="70" fill="#7B3F00" /><rect x="848" y="150" width="12" height="75" fill="#9C661F" /><rect x="864" y="160" width="14" height="65" fill="#704214" /><rect x="882" y="150" width="16" height="75" fill="#6B3410" /><rect x="902" y="155" width="12" height="70" fill="#8B6914" /><rect x="918" y="150" width="14" height="75" fill="#A0522D" /><rect x="936" y="158" width="16" height="67" fill="#8B4513" /><rect x="956" y="150" width="12" height="75" fill="#7B3F00" /><rect x="972" y="155" width="14" height="70" fill="#9C661F" /><rect x="990" y="150" width="16" height="75" fill="#704214" /><rect x="1010" y="160" width="12" height="65" fill="#6B3410" /><rect x="1026" y="150" width="14" height="75" fill="#8B6914" /><rect x="1044" y="155" width="16" height="70" fill="#A0522D" /><rect x="1064" y="150" width="12" height="75" fill="#8B4513" /><rect x="1080" y="158" width="14" height="67" fill="#7B3F00" /><rect x="1098" y="150" width="16" height="75" fill="#9C661F" />
      </g>
      {/* Hanging lamp */}
      <g transform="translate(600,0)">
        <line x1="0" y1="0" x2="0" y2="80" stroke="rgba(60,35,15,0.5)" strokeWidth="2" />
        <g transform="translate(0,90)">
          <motion.ellipse cx="0" cy="0" rx="40" ry="20" fill="rgba(220,180,100,0.2)"
            animate={{ opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 3, repeat: Infinity }} />
          <path d="M-25,0 L25,0 L20,25 L-20,25 Z" fill="rgba(80,50,20,0.6)" />
          <ellipse cx="0" cy="25" rx="15" ry="5" fill="rgba(255,220,120,0.5)" />
          <motion.circle cx="0" cy="25" r="30" fill="rgba(255,220,120,0.08)"
            animate={{ opacity: [0.05, 0.12, 0.05], r: [25, 35, 25] }} transition={{ duration: 3, repeat: Infinity }} />
        </g>
      </g>
      {/* Reading desk silhouette */}
      <g transform="translate(600,560)" fill="rgba(25,15,8,0.7)">
        <rect x="-60" y="0" width="120" height="8" />
        <rect x="-50" y="8" width="6" height="40" />
        <rect x="44" y="8" width="6" height="40" />
        <rect x="-45" y="0" width="90" height="3" transform="rotate(-3)" />
      </g>
    </svg>
  );
}

function JerusalemSadSilhouette() {
  return (
    <svg className="absolute bottom-0 left-0 w-full" style={{ height: '45%' }} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden>
      {/* Distant hills - muted */}
      <path d="M0,200 Q300,140 600,170 T1200,160 L1200,400 L0,400 Z" fill="rgba(60,65,75,0.4)" />
      {/* City walls - sad, broken */}
      <g fill="rgba(50,55,65,0.55)">
        <rect x="0" y="180" width="1200" height="30" />
        <rect x="100" y="140" width="60" height="70" />
        <rect x="180" y="130" width="80" height="80" />
        <rect x="280" y="150" width="50" height="60" />
        {/* Broken wall section */}
        <path d="M340,180 L380,180 L375,165 L385,155 L370,150 L390,140 L400,180 Z" />
        <rect x="420" y="120" width="90" height="90" />
        <rect x="520" y="135" width="70" height="75" />
        <rect x="600" y="110" width="100" height="100" />
        <rect x="710" y="130" width="65" height="80" />
        <rect x="790" y="125" width="85" height="85" />
        {/* Another broken section */}
        <path d="M890,180 L930,180 L920,160 L935,150 L915,145 L940,135 L950,180 Z" />
        <rect x="970" y="140" width="70" height="70" />
        <rect x="1050" y="125" width="80" height="85" />
        <rect x="1140" y="150" width="60" height="60" />
      </g>
      {/* Temple mount - subdued */}
      <g transform="translate(600,110)" fill="rgba(55,60,70,0.5)">
        <rect x="-50" y="0" width="100" height="100" />
        <path d="M-60,0 L0,-40 L60,0 Z" />
        <rect x="-35" y="20" width="15" height="80" fill="rgba(40,45,55,0.6)" />
        <rect x="-10" y="20" width="15" height="80" fill="rgba(40,45,55,0.6)" />
        <rect x="20" y="20" width="15" height="80" fill="rgba(40,45,55,0.6)" />
      </g>
      {/* Foreground rubble */}
      <g fill="rgba(45,50,60,0.5)">
        <ellipse cx="150" cy="220" rx="30" ry="12" />
        <ellipse cx="300" cy="225" rx="25" ry="10" />
        <rect x="380" y="210" width="20" height="15" transform="rotate(15 390 217)" />
        <ellipse cx="900" cy="220" rx="28" ry="11" />
        <rect x="950" y="208" width="18" height="18" transform="rotate(-20 959 217)" />
        <ellipse cx="1050" cy="225" rx="22" ry="9" />
      </g>
      {/* Ground */}
      <rect x="0" y="210" width="1200" height="190" fill="rgba(40,45,55,0.4)" />
    </svg>
  );
}

function JerusalemGoldSilhouette() {
  return (
    <svg className="absolute bottom-0 left-0 w-full" style={{ height: '45%' }} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden>
      {/* Distant hills - golden glow */}
      <path d="M0,200 Q300,140 600,170 T1200,160 L1200,400 L0,400 Z" fill="rgba(180,130,50,0.3)" />
      {/* City walls - radiant */}
      <g fill="rgba(200,150,60,0.45)">
        <rect x="0" y="180" width="1200" height="30" />
        <rect x="100" y="140" width="60" height="70" />
        <rect x="180" y="130" width="80" height="80" />
        <rect x="280" y="150" width="50" height="60" />
        <rect x="420" y="120" width="90" height="90" />
        <rect x="520" y="135" width="70" height="75" />
        <rect x="600" y="110" width="100" height="100" />
        <rect x="710" y="130" width="65" height="80" />
        <rect x="790" y="125" width="85" height="85" />
        <rect x="970" y="140" width="70" height="70" />
        <rect x="1050" y="125" width="80" height="85" />
        <rect x="1140" y="150" width="60" height="60" />
      </g>
      {/* Glorious temple */}
      <g transform="translate(600,110)">
        <path d="M-60,0 L0,-40 L60,0 Z" fill="rgba(240,200,100,0.5)" />
        <rect x="-50" y="0" width="100" height="100" fill="rgba(220,180,80,0.45)" />
        <rect x="-35" y="20" width="15" height="80" fill="rgba(255,220,120,0.4)" />
        <rect x="-10" y="20" width="15" height="80" fill="rgba(255,220,120,0.4)" />
        <rect x="20" y="20" width="15" height="80" fill="rgba(255,220,120,0.4)" />
        {/* Golden dome */}
        <motion.ellipse cx="0" cy="-40" rx="25" ry="20" fill="rgba(255,215,100,0.5)"
          animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="0" cy="-40" r="35" fill="rgba(255,215,100,0.1)"
          animate={{ r: [30, 40, 30], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 3, repeat: Infinity }} />
      </g>
      {/* Windows glowing warm */}
      <g fill="rgba(255,210,100,0.5)">
        <rect x="115" y="155" width="10" height="14" />
        <rect x="135" y="155" width="10" height="14" />
        <rect x="200" y="145" width="10" height="14" />
        <rect x="220" y="145" width="10" height="14" />
        <rect x="245" y="145" width="10" height="14" />
        <rect x="440" y="135" width="10" height="14" />
        <rect x="460" y="135" width="10" height="14" />
        <rect x="480" y="135" width="10" height="14" />
        <rect x="540" y="150" width="10" height="14" />
        <rect x="560" y="150" width="10" height="14" />
        <rect x="630" y="125" width="12" height="16" />
        <rect x="655" y="125" width="12" height="16" />
        <rect x="730" y="145" width="10" height="14" />
        <rect x="750" y="145" width="10" height="14" />
        <rect x="810" y="140" width="10" height="14" />
        <rect x="830" y="140" width="10" height="14" />
        <rect x="855" y="140" width="10" height="14" />
        <rect x="990" y="155" width="10" height="14" />
        <rect x="1070" y="140" width="10" height="14" />
        <rect x="1090" y="140" width="10" height="14" />
        <rect x="1160" y="165" width="10" height="14" />
      </g>
      {/* Ground - warm */}
      <rect x="0" y="210" width="1200" height="190" fill="rgba(160,110,40,0.3)" />
    </svg>
  );
}

function TempleSilhouette() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Floor */}
      <rect x="0" y="650" width="1200" height="150" fill="rgba(15,12,8,0.7)" />
      {/* Temple columns */}
      <g fill="rgba(30,25,18,0.7)">
        <rect x="80" y="300" width="50" height="350" />
        <rect x="200" y="280" width="55" height="370" />
        <rect x="330" y="260" width="60" height="390" />
        <rect x="470" y="250" width="60" height="400" />
        <rect x="670" y="250" width="60" height="400" />
        <rect x="810" y="260" width="60" height="390" />
        <rect x="950" y="280" width="55" height="370" />
        <rect x="1075" y="300" width="50" height="350" />
      </g>
      {/* Column capitals */}
      <g fill="rgba(40,33,22,0.6)">
        <rect x="70" y="285" width="70" height="20" />
        <rect x="188" y="265" width="80" height="20" />
        <rect x="318" y="245" width="85" height="20" />
        <rect x="458" y="235" width="85" height="20" />
        <rect x="658" y="235" width="85" height="20" />
        <rect x="798" y="245" width="85" height="20" />
        <rect x="938" y="265" width="80" height="20" />
        <rect x="1065" y="285" width="70" height="20" />
      </g>
      {/* Temple roof / lintel */}
      <rect x="60" y="200" width="1080" height="45" fill="rgba(25,20,15,0.7)" />
      <path d="M40,200 L600,130 L1160,200 Z" fill="rgba(20,16,10,0.6)" />
      {/* Idol statues on pedestals */}
      <g transform="translate(280,540)" fill="rgba(20,15,10,0.8)">
        <rect x="-25" y="0" width="50" height="110" />
        <rect x="-35" y="-5" width="70" height="10" />
        <ellipse cx="0" cy="-30" rx="18" ry="25" />
        <rect x="-15" y="-10" width="30" height="15" />
        <circle cx="0" cy="-35" r="12" fill="rgba(35,25,15,0.7)" />
        {/* Glowing eyes */}
        <motion.circle cx="-4" cy="-37" r="2" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="4" cy="-37" r="2" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
      </g>
      <g transform="translate(600,520)" fill="rgba(20,15,10,0.8)">
        <rect x="-30" y="0" width="60" height="130" />
        <rect x="-40" y="-5" width="80" height="10" />
        <ellipse cx="0" cy="-35" rx="22" ry="30" />
        <rect x="-18" y="-12" width="36" height="18" />
        <circle cx="0" cy="-40" r="15" fill="rgba(35,25,15,0.7)" />
        <motion.circle cx="-5" cy="-42" r="2.5" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.circle cx="5" cy="-42" r="2.5" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }} />
      </g>
      <g transform="translate(920,540)" fill="rgba(20,15,10,0.8)">
        <rect x="-25" y="0" width="50" height="110" />
        <rect x="-35" y="-5" width="70" height="10" />
        <ellipse cx="0" cy="-30" rx="18" ry="25" />
        <rect x="-15" y="-10" width="30" height="15" />
        <circle cx="0" cy="-35" r="12" fill="rgba(35,25,15,0.7)" />
        <motion.circle cx="-4" cy="-37" r="2" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }} />
        <motion.circle cx="4" cy="-37" r="2" fill="rgba(200,80,40,0.6)"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }} />
      </g>
      {/* Dramatic light shafts from above */}
      <motion.polygon points="300,200 350,200 420,650 250,650" fill="rgba(200,120,60,0.04)"
        animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.polygon points="580,200 620,200 680,650 520,650" fill="rgba(200,120,60,0.05)"
        animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />
      <motion.polygon points="850,200 900,200 960,650 800,650" fill="rgba(200,120,60,0.04)"
        animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2 }} />
    </svg>
  );
}

function SilhouetteLayer({ type }: { type: EnvConfig['silhouette'] }) {
  switch (type) {
    case 'city': return <CitySilhouette />;
    case 'mirror': return <MirrorSilhouette />;
    case 'night': return <NightSilhouette />;
    case 'library': return <LibrarySilhouette />;
    case 'jerusalem-sad': return <JerusalemSadSilhouette />;
    case 'jerusalem-gold': return <JerusalemGoldSilhouette />;
    case 'temple': return <TempleSilhouette />;
    default: return null;
  }
}

/* ── Floating particle elements ── */
function FloatingElements({ items, dark }: { items: FloatItem[]; dark: boolean }) {
  const positions = useMemo(
    () => items.map((_, i) => ({
      left: ((i * 37 + 13) % 90) + 5,
      top: ((i * 53 + 7) % 70) + 10,
    })),
    [items],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute select-none"
          style={{
            left: `${positions[i].left}%`,
            top: `${positions[i].top}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            filter: dark ? `drop-shadow(0 0 8px rgba(255,255,200,0.3))` : 'none',
          }}
          animate={{
            y: [0, -item.drift, 0],
            x: [0, item.drift * 0.3, 0],
            opacity: [item.opacity * 0.5, item.opacity, item.opacity * 0.5],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Atmospheric light orb ── */
function LightOrb({ x, y, size, color, pulse }: { x: string; y: string; size: number; color: string; pulse: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
      animate={pulse ? { opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] } : {}}
      transition={pulse ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  );
}

/* ── Vignette overlay ── */
function Vignette({ intensity, dark }: { intensity: number; dark: boolean }) {
  const color = dark ? `rgba(0,0,0,${intensity})` : `rgba(40,25,10,${intensity * 0.5})`;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at center, transparent 40%, ${color} 100%)` }}
    />
  );
}

/* ── Main component ── */
export function StationEnvironment({ stationId, children }: StationEnvironmentProps) {
  const env = envConfigs[stationId] ?? envConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen overflow-hidden"
      style={{ background: env.bg }}
    >
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: env.atmosphere }} />

      {/* SVG Silhouette layer */}
      <SilhouetteLayer type={env.silhouette} />

      {/* Light orb */}
      {env.lightOrb && (
        <LightOrb
          x={env.lightOrb.x}
          y={env.lightOrb.y}
          size={env.lightOrb.size}
          color={env.lightOrb.color}
          pulse={env.lightOrb.pulse}
        />
      )}

      {/* Floating particles */}
      <FloatingElements items={env.floaters} dark={env.dark} />

      {/* Vignette */}
      <Vignette intensity={env.vignette} dark={env.dark} />

      {/* Content */}
      <div className={`relative z-10 ${env.textClass}`}>
        {children}
      </div>
    </motion.div>
  );
}
