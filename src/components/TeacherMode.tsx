import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Settings, Unlock, Lock, RotateCcw, Star, Award, Volume2, VolumeX, Sparkles, X } from 'lucide-react';

interface TeacherModeProps {
  teacherMode: boolean;
  allUnlocked: boolean;
  soundEnabled: boolean;
  effectsEnabled: boolean;
  onToggleTeacherMode: (v: boolean) => void;
  onUnlockAll: () => void;
  onLockAll: () => void;
  onResetJourney: () => void;
  onResetStars: () => void;
  onUnlockAllBadges: () => void;
  onToggleSound: () => void;
  onToggleEffects: () => void;
}

export function TeacherMode(props: TeacherModeProps) {
  const [open, setOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const destructiveActions: Record<string, () => void> = {
    resetJourney: props.onResetJourney,
    resetStars: props.onResetStars,
  };

  const handleConfirm = () => {
    if (confirmAction && destructiveActions[confirmAction]) {
      destructiveActions[confirmAction]();
    }
    setConfirmAction(null);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 p-3 rounded-full bg-parchment-200 hover:bg-parchment-300 shadow-lg border-2 border-parchment-400 focus:outline-none focus:ring-4 focus:ring-gold-400"
        aria-label="الإعدادات"
      >
        <Settings className="w-6 h-6 text-royal-700" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-parchment-50 rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-royal-400 max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-black text-royal-800 flex items-center gap-2">
                  👨‍🏫 وضع الخادم
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full bg-parchment-200 hover:bg-parchment-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5 text-royal-700" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Unlock all stations */}
                <button
                  onClick={props.onUnlockAll}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-sage-300 hover:bg-sage-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-sage-400"
                >
                  <Unlock className="w-6 h-6 text-sage-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">فتح كل المحطات</span>
                </button>

                {/* Lock all stations */}
                <button
                  onClick={props.onLockAll}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-stone-300 hover:bg-stone-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <Lock className="w-6 h-6 text-stone-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">إغلاق كل المحطات</span>
                </button>

                {/* Reset journey */}
                <button
                  onClick={() => setConfirmAction('resetJourney')}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-clay-300 hover:bg-clay-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-clay-400"
                >
                  <RotateCcw className="w-6 h-6 text-clay-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">تصفير الرحلة</span>
                </button>

                {/* Reset stars */}
                <button
                  onClick={() => setConfirmAction('resetStars')}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-gold-300 hover:bg-gold-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <Star className="w-6 h-6 text-gold-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">تصفير النجوم</span>
                </button>

                {/* Unlock all badges */}
                <button
                  onClick={props.onUnlockAllBadges}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-violet-300 hover:bg-violet-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <Award className="w-6 h-6 text-violet-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">إظهار كل الـ Badges</span>
                </button>

                {/* Sound toggle */}
                <button
                  onClick={props.onToggleSound}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-sky-300 hover:bg-sky-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {props.soundEnabled ? <Volume2 className="w-6 h-6 text-sky-600" /> : <VolumeX className="w-6 h-6 text-sky-600" />}
                  <span className="font-bold text-royal-800 flex-1 text-right">
                    {props.soundEnabled ? 'إيقاف الأصوات' : 'تشغيل الأصوات'}
                  </span>
                </button>

                {/* Effects toggle */}
                <button
                  onClick={props.onToggleEffects}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-4 border-teal-300 hover:bg-teal-50 transition-all text-right focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <Sparkles className="w-6 h-6 text-teal-600" />
                  <span className="font-bold text-royal-800 flex-1 text-right">
                    {props.effectsEnabled ? 'إيقاف المؤثرات' : 'تشغيل المؤثرات'}
                  </span>
                </button>
              </div>

              {/* Confirmation dialog */}
              <AnimatePresence>
                {confirmAction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 bg-clay-100 rounded-2xl p-5 border-4 border-clay-400 text-center"
                  >
                    <p className="font-display text-lg font-bold text-clay-700 mb-4">
                      هل أنت متأكد؟
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleConfirm}
                        className="px-6 py-2 rounded-full bg-clay-500 text-white font-bold shadow-md hover:bg-clay-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-clay-300"
                      >
                        نعم، متأكد
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-6 py-2 rounded-full bg-parchment-200 text-royal-700 font-bold shadow-md hover:bg-parchment-300 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-parchment-400"
                      >
                        إلغاء
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
