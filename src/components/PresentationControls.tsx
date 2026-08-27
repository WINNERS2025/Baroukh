import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface PresentationControlsProps {
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  /** Show the keyboard hint */
  showHint?: boolean;
}

export function PresentationControls({
  presentationMode,
  onTogglePresentationMode,
  showHint = true,
}: PresentationControlsProps) {
  return (
    <>
      {/* Floating presentation mode toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePresentationMode}
        className="fixed top-4 left-4 z-[80] flex items-center gap-2 px-4 py-2 rounded-full bg-royal-700 text-white font-bold shadow-lg border-2 border-gold-400 hover:bg-royal-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gold-300"
        aria-label="وضع العرض"
      >
        {presentationMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        <span className="hidden sm:inline text-sm">{presentationMode ? 'خروج' : 'وضع العرض'}</span>
      </motion.button>

      {/* Keyboard hint — subtle, bottom center */}
      <AnimatePresence>
        {showHint && !presentationMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[75] flex items-center gap-3 px-4 py-2 rounded-full bg-royal-900/70 backdrop-blur text-white text-sm font-semibold shadow-lg pointer-events-none"
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> السابق
            </span>
            <span className="text-gold-300">|</span>
            <span>مسافة / ← التالي →</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
