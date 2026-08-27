import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Backpack, X, Lock, Sparkles } from 'lucide-react';
import { inventoryItems } from '@/data/inventory';

interface InventoryBagProps {
  unlockedInventory: number[];
  presentationMode?: boolean;
}

export function InventoryBag({ unlockedInventory, presentationMode = false }: InventoryBagProps) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [newItemStation, setNewItemStation] = useState<number | null>(null);
  const prevUnlockedRef = useRef<number[]>(unlockedInventory);

  const unlockedCount = unlockedInventory.length;

  // Detect newly unlocked item
  useEffect(() => {
    const prev = prevUnlockedRef.current;
    const newItems = unlockedInventory.filter((id) => !prev.includes(id));
    if (newItems.length > 0) {
      setNewItemStation(newItems[0]);
      const timer = setTimeout(() => setNewItemStation(null), 4000);
      prevUnlockedRef.current = unlockedInventory;
      return () => clearTimeout(timer);
    }
    prevUnlockedRef.current = unlockedInventory;
  }, [unlockedInventory]);

  const newItem = newItemStation
    ? inventoryItems.find((i) => i.stationId === newItemStation)
    : null;

  return (
    <>
      {/* Floating button — hidden in presentation mode */}
      {!presentationMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => { setOpen(true); }}
          className="fixed bottom-4 left-4 z-30 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-l from-royal-600 to-royal-800 text-white font-bold shadow-xl border-2 border-gold-300/50 focus:outline-none focus:ring-4 focus:ring-gold-400/50"
          aria-label="حقيبة الرحلة"
        >
          <Backpack className="w-6 h-6" />
          <span className="hidden sm:inline">حقيبة الرحلة</span>
          <span className="bg-gold-400 text-royal-900 rounded-full px-2 py-0.5 text-xs font-black">
            {unlockedCount}/{inventoryItems.length}
          </span>
        </motion.button>
      )}

      {/* New item celebration popup */}
      <AnimatePresence>
        {newItem && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[65] pointer-events-none"
          >
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white shadow-2xl border-2"
              style={{ borderColor: 'rgba(205,170,78,0.5)' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, delay: 0.15 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md"
                style={{ background: `linear-gradient(135deg, ${newItem.glow}, rgba(255,255,255,0.8))` }}
              >
                {newItem.emoji}
              </motion.div>
              <div>
                <p className="text-xs font-bold text-gold-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  أُضيفت إلى الحقيبة
                </p>
                <p className="font-display text-lg font-black text-royal-800">{newItem.name}</p>
              </div>
            </div>
            {/* Sparkle particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-sm"
                style={{ left: '50%', top: '50%' }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [1, 0],
                  x: (Math.cos((i / 6) * Math.PI * 2) * 60),
                  y: (Math.sin((i / 6) * Math.PI * 2) * 60),
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backpack modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-parchment-50 to-parchment-100 rounded-3xl p-6 max-w-lg w-full shadow-2xl border-4 border-gold-300 max-h-[80vh] overflow-y-auto scrollbar-hide"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-2xl font-black text-royal-800 flex items-center gap-2">
                  <Backpack className="w-7 h-7 text-royal-600" />
                  🎒 حقيبة الرحلة
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full bg-parchment-200 hover:bg-parchment-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5 text-royal-700" />
                </button>
              </div>
              <p className="text-sm text-royal-600/70 font-semibold mb-5">
                {unlockedCount} من {inventoryItems.length} قطعة مجموعة
              </p>

              {/* Items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inventoryItems.map((item, i) => {
                  const unlocked = unlockedInventory.includes(item.stationId);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                      onClick={() => unlocked && setSelectedItem(item.id)}
                      disabled={!unlocked}
                      whileHover={unlocked ? { scale: 1.05, y: -2 } : {}}
                      className={`relative rounded-2xl p-4 border-3 transition-all text-center ${
                        unlocked
                          ? 'bg-white border-gold-300 cursor-pointer shadow-md hover:shadow-lg'
                          : 'bg-parchment-100/60 border-parchment-200 opacity-50 cursor-not-allowed'
                      }`}
                      style={{ borderWidth: '3px' }}
                    >
                      {unlocked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.06 + 0.2, type: 'spring', stiffness: 260 }}
                          className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-2"
                          style={{ background: `linear-gradient(135deg, ${item.glow}, rgba(255,255,255,0.5))` }}
                        >
                          {item.emoji}
                        </motion.div>
                      ) : (
                        <div className="w-14 h-14 mx-auto rounded-xl bg-parchment-200/50 flex items-center justify-center text-3xl mb-2 text-parchment-400">
                          <Lock className="w-6 h-6" />
                        </div>
                      )}
                      <p className={`text-xs font-bold leading-tight ${unlocked ? 'text-royal-800' : 'text-parchment-500'}`}>
                        {unlocked ? item.name : 'مقفول'}
                      </p>
                      {unlocked && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center text-[10px] font-black text-royal-900 border-2 border-white">
                          {item.stationId}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Item detail card */}
              <AnimatePresence>
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 20, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    {(() => {
                      const item = inventoryItems.find((i) => i.id === selectedItem)!;
                      return (
                        <div className="bg-white rounded-2xl p-5 border-3 border-gold-300 shadow-md" style={{ borderWidth: '3px' }}>
                          <div className="flex items-center gap-4 mb-3">
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 260 }}
                              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md"
                              style={{ background: `linear-gradient(135deg, ${item.glow}, rgba(255,255,255,0.4))` }}
                            >
                              {item.emoji}
                            </motion.div>
                            <div>
                              <h3 className="font-display text-xl font-black text-royal-800">
                                {item.name}
                              </h3>
                              <p className="text-xs font-bold text-gold-600 mt-0.5">
                                المحطة {item.stationId}
                              </p>
                            </div>
                          </div>
                          <p className="text-base text-royal-700 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state encouragement */}
              {unlockedCount === 0 && (
                <div className="text-center mt-4 py-6">
                  <p className="text-royal-600/70 font-semibold">
                    أكمل المحطة الأولى لتبدأ بتجميع القطع ✨
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
