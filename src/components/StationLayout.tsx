import { motion } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { ProgressBar } from './ProgressBar';

interface StationLayoutProps {
  stationNumber: number;
  total: number;
  title: string;
  icon: string;
  accentClass: string;
  completedCount: number;
  stationStars: number;
  maxStars: number;
  totalStars: number;
  maxTotalStars: number;
  badgeCount: number;
  maxBadges: number;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  children: ReactNode;
}

export function StationLayout({
  stationNumber,
  total,
  title,
  icon,
  accentClass,
  completedCount,
  stationStars,
  maxStars,
  totalStars,
  maxTotalStars,
  badgeCount,
  maxBadges,
  onBack,
  soundEnabled,
  onToggleSound,
  children,
}: StationLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-parchment-texture"
    >
      <header className="sticky top-0 z-40 bg-parchment-50/90 backdrop-blur-md border-b-2 border-parchment-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-royal-500 text-white font-bold shadow-md hover:bg-royal-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-royal-300"
              aria-label="العودة للخريطة"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للخريطة
            </button>

            <div className="flex items-center gap-3">
              <span className={`font-display text-lg font-bold ${accentClass}`}>
                المحطة {stationNumber} من {total}
              </span>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold-100 border border-gold-300">
                {Array.from({ length: maxStars }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < stationStars
                        ? 'fill-gold-400 text-gold-500'
                        : 'fill-parchment-200 text-parchment-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onToggleSound}
                className="p-2 rounded-full bg-parchment-200 hover:bg-parchment-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gold-300"
                aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-royal-700" />
                ) : (
                  <VolumeX className="w-5 h-5 text-royal-700" />
                )}
              </button>
            </div>
          </div>
          <ProgressBar
            completed={completedCount}
            total={total}
            totalStars={totalStars}
            maxStars={maxTotalStars}
            badgeCount={badgeCount}
            maxBadges={maxBadges}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-2 animate-float inline-block">{icon}</div>
          <h1 className={`font-display text-4xl md:text-5xl font-black ${accentClass} text-shadow-soft`}>
            {title}
          </h1>
        </motion.div>
        {children}
      </main>
    </motion.div>
  );
}
