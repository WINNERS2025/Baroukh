import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { QuizQuestion } from '@/data/questions';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
  title?: string;
}

export function Quiz({ questions, onComplete, title = 'التحدي' }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      onComplete();
    }
  };

  const isCorrect = selected === q.correctIndex;

  return (
    <div className="max-w-2xl mx-auto">
      {title && (
        <h3 className="font-display text-2xl font-bold text-royal-800 text-center mb-4">
          {title}
        </h3>
      )}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < current
                ? 'bg-sage-500'
                : i === current
                ? 'bg-royal-500 scale-125'
                : 'bg-parchment-300'
            } transition-all`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-parchment border-4 border-parchment-200"
        >
          <p className="font-display text-xl md:text-2xl font-bold text-royal-900 mb-6 text-center">
            {q.question}
          </p>
          <div className="grid gap-3">
            {q.options.map((opt, idx) => {
              const isThis = selected === idx;
              const isAnswer = idx === q.correctIndex;
              let cls =
                'border-parchment-300 bg-parchment-50 hover:bg-parchment-100 text-royal-800';
              if (showFeedback) {
                if (isAnswer) cls = 'border-sage-500 bg-sage-100 text-sage-800';
                else if (isThis) cls = 'border-clay-500 bg-clay-100 text-clay-700';
                else cls = 'border-parchment-200 bg-parchment-50 text-royal-400';
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showFeedback}
                  className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-4 text-lg font-bold transition-all ${cls} ${
                    !showFeedback ? 'hover:scale-[1.02] active:scale-95' : ''
                  } focus:outline-none focus:ring-4 focus:ring-gold-300`}
                >
                  <span>{opt}</span>
                  {showFeedback && isAnswer && (
                    <Check className="w-6 h-6 text-sage-600" />
                  )}
                  {showFeedback && isThis && !isAnswer && (
                    <X className="w-6 h-6 text-clay-600" />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5"
              >
                <div
                  className={`rounded-2xl p-4 text-center font-bold text-lg ${
                    isCorrect
                      ? 'bg-sage-100 text-sage-700'
                      : 'bg-gold-100 text-gold-800'
                  }`}
                >
                  {isCorrect
                    ? 'ممتاز! أحسنت التفكير!'
                    : 'قريب جدًا! جرّب مرة أخرى ❤️'}
                  {!isCorrect && (
                    <p className="text-base font-semibold mt-2 text-royal-700">
                      {q.hint}
                    </p>
                  )}
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleNext}
                  className="w-full mt-4 py-3 rounded-full bg-royal-500 text-white font-bold text-lg shadow-lg hover:bg-royal-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-royal-300"
                >
                  {current < questions.length - 1 ? 'السؤال التالي' : 'إنهاء التحدي'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
