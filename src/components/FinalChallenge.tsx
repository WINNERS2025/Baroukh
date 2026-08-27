import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, X, Trophy, ChevronRight, ChevronLeft, GripVertical, Lightbulb } from 'lucide-react';
import { finalQuestions } from '@/data/questions';
import type { FinalQuestion } from '@/data/questions';
import type { SoundType } from '@/hooks/useSound';

interface FinalChallengeProps {
  onComplete: () => void;
  onBack: () => void;
  play?: (type: SoundType) => void;
  onScoreChange?: (score: number) => void;
}

/* ── Helpers ── */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FinalChallenge({ onComplete, onBack, play = () => {}, onScoreChange }: FinalChallengeProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showScore, setShowScore] = useState(false);

  // Ordering question state
  const [order, setOrder] = useState<string[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Who-am-i state
  const [revealedClues, setRevealedClues] = useState(1);

  const q = finalQuestions[current];

  // Reset per-question state when current changes
  useEffect(() => {
    setShowFeedback(false);
    setIsCorrect(false);
    setOrderSubmitted(false);
    setRevealedClues(1);
    if (q.type === 'ordering') {
      setOrder(shuffle(q.items.map((it) => it.id)));
    }
  }, [current, q]);

  /* ── Answer checking ── */
  const checkAnswer = useCallback((correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswers((prev) => [...prev, correct]);
    play(correct ? 'correct' : 'wrong');
  }, [play]);

  const handleSelectChoice = (idx: number) => {
    if (showFeedback) return;
    const correct = idx === (q as { correctIndex: number }).correctIndex;
    checkAnswer(correct);
  };

  const handleTrueFalse = (choice: boolean) => {
    if (showFeedback) return;
    const correct = choice === (q as { isTrue: boolean }).isTrue;
    checkAnswer(correct);
  };

  const handleRevealClue = () => {
    if (revealedClues < (q as { clues: string[] }).clues.length) {
      setRevealedClues((c) => c + 1);
      play('click');
    }
  };

  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
    if (showFeedback) return;
    setOrder((prev) => {
      const next = [...prev];
      const swapIdx = direction === 'up' ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
      return next;
    });
    play('click');
  };

  const submitOrder = () => {
    if (showFeedback) return;
    const correctOrder = (q as { correctOrder: string[] }).correctOrder;
    const correct = order.every((id, i) => id === correctOrder[i]);
    setOrderSubmitted(true);
    checkAnswer(correct);
  };

  /* ── Navigation (presenter controls) ── */
  const handleNext = useCallback(() => {
    if (showScore) return;
    if (!showFeedback) return; // Must answer first
    if (current < finalQuestions.length - 1) {
      setCurrent((c) => c + 1);
      play('click');
    } else {
      const correctCount = answers.filter(Boolean).length;
      onScoreChange?.(correctCount);
      play('complete');
      setShowScore(true);
    }
  }, [showFeedback, showScore, current, answers, onScoreChange, play]);

  const handlePrev = useCallback(() => {
    if (showScore) return;
    if (current > 0) {
      setCurrent((c) => c - 1);
      setAnswers((prev) => prev.slice(0, -1));
      play('click');
    }
  }, [current, showScore, play]);

  /* ── Keyboard: →/SPACE = next, ← = prev ── */
  const nextRef = useRef(handleNext);
  const prevRef = useRef(handlePrev);
  nextRef.current = handleNext;
  prevRef.current = handlePrev;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextRef.current();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevRef.current();
      }
    };
    window.addEventListener('keydown', handleKey, { passive: false });
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const correctCount = answers.filter(Boolean).length;
  const totalQuestions = finalQuestions.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="min-h-screen bg-gradient-to-b from-gold-100 via-parchment-100 to-royal-100"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Trophy className="w-16 h-16 text-gold-500 drop-shadow-lg mx-auto" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-royal-900 mt-2">
            🏆 التحدي النهائي
          </h1>
          <p className="font-display text-lg text-royal-700 mt-1">
            مراجعة شاملة لرحلة سفر باروخ
          </p>
        </motion.div>

        {/* Progress dots + counter */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {finalQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < current
                  ? answers[i] ? 'bg-sage-500' : 'bg-clay-400'
                  : i === current
                  ? 'bg-gold-500 scale-125'
                  : 'bg-parchment-300'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm font-bold text-royal-600/70 mb-4">
          السؤال {current + 1} من {totalQuestions}
        </p>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-gold-400"
          >
            {/* Question type badge */}
            <div className="flex justify-center mb-4">
              <TypeBadge type={q.type} />
            </div>

            <p className="font-display text-xl md:text-2xl font-bold text-royal-900 mb-6 text-center">
              {q.question}
            </p>

            {/* Render question by type */}
            {q.type === 'multiple-choice' && (
              <ChoiceList
                options={q.options}
                correctIndex={q.correctIndex}
                selected={showFeedback}
                onSelect={handleSelectChoice}
              />
            )}

            {q.type === 'true-false' && (
              <TrueFalseUI
                statement={q.statement}
                isTrue={q.isTrue}
                answered={showFeedback}
                onAnswer={handleTrueFalse}
              />
            )}

            {q.type === 'ordering' && (
              <OrderingUI
                items={q.items}
                order={order}
                correctOrder={q.correctOrder}
                submitted={orderSubmitted}
                onMove={moveOrderItem}
                onSubmit={submitOrder}
              />
            )}

            {q.type === 'who-am-i' && (
              <WhoAmIUI
                clues={q.clues}
                revealedClues={revealedClues}
                onRevealClue={handleRevealClue}
                options={q.options}
                correctIndex={q.correctIndex}
                answered={showFeedback}
                onSelect={handleSelectChoice}
              />
            )}

            {q.type === 'key-lesson' && (
              <ChoiceList
                options={q.options}
                correctIndex={q.correctIndex}
                selected={showFeedback}
                onSelect={handleSelectChoice}
              />
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5"
                >
                  <div
                    className={`rounded-2xl p-4 text-center font-bold text-lg ${
                      isCorrect ? 'bg-sage-100 text-sage-700' : 'bg-gold-100 text-gold-800'
                    }`}
                  >
                    {isCorrect ? 'أحسنت! إجابة ممتازة! 🌟' : 'قريب جدًا! الإجابة الصحيحة في التلميح 👇'}
                    {!isCorrect && (
                      <p className="text-base font-semibold mt-2 text-royal-700 flex items-start justify-center gap-2">
                        <Lightbulb className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span>{q.hint}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex items-center justify-between mt-6 px-2">
          <button
            onClick={handlePrev}
            disabled={current === 0 || showScore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-royal-700 font-bold shadow-md hover:scale-105 active:scale-95 transition-all border-2 border-royal-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-royal-200"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-100/80 border border-gold-300">
            <span className="text-xs font-semibold text-gold-700">التالي</span>
            <ChevronLeft className="w-4 h-4 text-gold-700" />
            <span className="text-[10px] text-gold-600/70">/ مسافة</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!showFeedback || showScore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gold-300"
          >
            <span>{current < finalQuestions.length - 1 ? 'التالي' : 'إنهاء التحدي'}</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Back to map */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onBack}
            disabled={showScore}
            className="px-6 py-2 rounded-full bg-white/60 text-royal-700 font-bold shadow-sm hover:scale-105 active:scale-95 transition-all border-2 border-royal-200 disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-royal-200"
          >
            ← العودة للخريطة
          </button>
        </div>
      </div>

      {/* Score Screen */}
      <AnimatePresence>
        {showScore && (
          <ScoreScreen
            correctCount={correctCount}
            total={totalQuestions}
            onComplete={() => {
              play('finalCelebration');
              onComplete();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Type Badge ── */
function TypeBadge({ type }: { type: string }) {
  const badges: Record<string, { label: string; emoji: string; color: string }> = {
    'multiple-choice': { label: 'اختر الإجابة الصحيحة', emoji: '📋', color: 'bg-royal-100 text-royal-700' },
    'true-false': { label: 'صح أم خطأ', emoji: '⚖️', color: 'bg-teal-100 text-teal-700' },
    'ordering': { label: 'رتّب بالترتيب', emoji: '🔢', color: 'bg-amber-100 text-amber-700' },
    'who-am-i': { label: 'من أنا؟', emoji: '🔍', color: 'bg-rose-100 text-rose-700' },
    'key-lesson': { label: 'الدرس الأساسي', emoji: '💡', color: 'bg-gold-100 text-gold-700' },
  };
  const b = badges[type] ?? badges['multiple-choice'];
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${b.color}`}>
      {b.emoji} {b.label}
    </span>
  );
}

/* ── Choice List (multiple-choice + key-lesson) ── */
function ChoiceList({
  options,
  correctIndex,
  selected,
  onSelect,
}: {
  options: string[];
  correctIndex: number;
  selected: boolean;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((opt, idx) => {
        const isThis = selected && idx === correctIndex;
        const isAnswer = idx === correctIndex;
        let cls = 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100 text-royal-800';
        if (selected) {
          if (isAnswer) cls = 'border-sage-500 bg-sage-100 text-sage-800';
          else cls = 'border-parchment-200 bg-parchment-50 text-royal-400';
        }
        return (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            disabled={selected}
            className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-4 text-lg font-bold transition-all ${cls} ${
              !selected ? 'hover:scale-[1.02] active:scale-95' : ''
            } focus:outline-none focus:ring-4 focus:ring-gold-300`}
          >
            <span>{opt}</span>
            {selected && isAnswer && <Check className="w-6 h-6 text-sage-600" />}
            {selected && isThis && !isAnswer && <X className="w-6 h-6 text-clay-600" />}
          </button>
        );
      })}
    </div>
  );
}

/* ── True/False UI ── */
function TrueFalseUI({
  statement,
  isTrue,
  answered,
  onAnswer,
}: {
  statement: string;
  isTrue: boolean;
  answered: boolean;
  onAnswer: (choice: boolean) => void;
}) {
  return (
    <div>
      {/* Statement card */}
      <div className="bg-royal-50 rounded-2xl p-6 mb-4 border-4 border-royal-200">
        <p className="font-display text-xl md:text-2xl font-bold text-royal-800 text-center">
          «{statement}»
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAnswer(true)}
          disabled={answered}
          className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-4 text-xl font-bold transition-all ${
            answered && isTrue
              ? 'border-sage-500 bg-sage-100 text-sage-800'
              : answered
              ? 'border-parchment-200 bg-parchment-50 text-royal-400'
              : 'border-sage-300 bg-sage-50 text-sage-700 hover:scale-105 active:scale-95'
          } focus:outline-none focus:ring-4 focus:ring-sage-200`}
        >
          <Check className="w-8 h-8" />
          <span>صح</span>
        </button>
        <button
          onClick={() => onAnswer(false)}
          disabled={answered}
          className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-4 text-xl font-bold transition-all ${
            answered && !isTrue
              ? 'border-clay-500 bg-clay-100 text-clay-700'
              : answered
              ? 'border-parchment-200 bg-parchment-50 text-royal-400'
              : 'border-clay-300 bg-clay-50 text-clay-700 hover:scale-105 active:scale-95'
          } focus:outline-none focus:ring-4 focus:ring-clay-200`}
        >
          <X className="w-8 h-8" />
          <span>خطأ</span>
        </button>
      </div>
    </div>
  );
}

/* ── Ordering UI ── */
function OrderingUI({
  items,
  order,
  correctOrder,
  submitted,
  onMove,
  onSubmit,
}: {
  items: { id: string; label: string; emoji: string }[];
  order: string[];
  correctOrder: string[];
  submitted: boolean;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onSubmit: () => void;
}) {
  const itemMap = new Map(items.map((it) => [it.id, it]));

  return (
    <div>
      <div className="grid gap-2 mb-4">
        {order.map((id, i) => {
          const item = itemMap.get(id)!;
          const isCorrectPos = submitted && correctOrder[i] === id;
          return (
            <div
              key={id}
              className={`flex items-center gap-3 p-3 rounded-2xl border-4 transition-all ${
                submitted
                  ? isCorrectPos
                    ? 'border-sage-500 bg-sage-100'
                    : 'border-clay-400 bg-clay-100'
                  : 'border-parchment-300 bg-parchment-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onMove(i, 'up')}
                  disabled={submitted || i === 0}
                  className="p-1 rounded-lg bg-white/80 hover:bg-white transition-colors disabled:opacity-30 focus:outline-none"
                  aria-label="تحريك لأعلى"
                >
                  <ChevronLeft className="w-4 h-4 text-royal-600 rotate-90" />
                </button>
                <button
                  onClick={() => onMove(i, 'down')}
                  disabled={submitted || i === order.length - 1}
                  className="p-1 rounded-lg bg-white/80 hover:bg-white transition-colors disabled:opacity-30 focus:outline-none"
                  aria-label="تحريك لأسفل"
                >
                  <ChevronLeft className="w-4 h-4 text-royal-600 -rotate-90" />
                </button>
              </div>
              <GripVertical className="w-5 h-5 text-parchment-400" />
              <div className="flex-1 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-gold-300 text-royal-900 flex items-center justify-center text-sm font-black flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-bold text-royal-800 text-base md:text-lg">{item.label}</span>
              </div>
              {submitted && (
                isCorrectPos
                  ? <Check className="w-5 h-5 text-sage-600" />
                  : <X className="w-5 h-5 text-clay-500" />
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <button
          onClick={onSubmit}
          className="w-full py-3 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
        >
          تأكيد الترتيب
        </button>
      )}
    </div>
  );
}

/* ── Who Am I UI ── */
function WhoAmIUI({
  clues,
  revealedClues,
  onRevealClue,
  options,
  correctIndex,
  answered,
  onSelect,
}: {
  clues: string[];
  revealedClues: number;
  onRevealClue: () => void;
  options: string[];
  correctIndex: number;
  answered: boolean;
  onSelect: (idx: number) => void;
}) {
  return (
    <div>
      {/* Clue cards */}
      <div className="space-y-2 mb-4">
        {clues.map((clue, i) => (
          <AnimatePresence key={i}>
            {i < revealedClues && (
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="flex items-center gap-3 bg-rose-50 rounded-2xl p-3 border-2 border-rose-200"
              >
                <span className="w-8 h-8 rounded-full bg-rose-300 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                  {i + 1}
                </span>
                <span className="font-bold text-rose-800 text-base">{clue}</span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Reveal next clue button */}
      {revealedClues < clues.length && !answered && (
        <button
          onClick={onRevealClue}
          className="w-full py-2.5 rounded-full bg-rose-100 text-rose-700 font-bold text-base border-2 border-rose-300 hover:scale-[1.02] active:scale-95 transition-all mb-4 focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          🔍 كشف تلميح آخر ({revealedClues}/{clues.length})
        </button>
      )}

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, idx) => {
          const isAnswer = idx === correctIndex;
          let cls = 'border-parchment-300 bg-parchment-50 hover:bg-parchment-100 text-royal-800';
          if (answered) {
            if (isAnswer) cls = 'border-sage-500 bg-sage-100 text-sage-800';
            else cls = 'border-parchment-200 bg-parchment-50 text-royal-400';
          }
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              disabled={answered}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-4 text-lg font-bold transition-all ${cls} ${
                !answered ? 'hover:scale-[1.02] active:scale-95' : ''
              } focus:outline-none focus:ring-4 focus:ring-gold-300`}
            >
              <span>{opt}</span>
              {answered && isAnswer && <Check className="w-5 h-5 text-sage-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Score Screen ── */
function ScoreScreen({
  correctCount,
  total,
  onComplete,
}: {
  correctCount: number;
  total: number;
  onComplete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl border-4 border-gold-400"
      >
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Trophy className="w-20 h-20 text-gold-500 mx-auto" />
        </motion.div>
        <h2 className="font-display text-2xl font-black text-royal-900 mb-2">
          أحسنت! أنهيت التحدي
        </h2>

        {/* Star display */}
        <div className="flex justify-center gap-1.5 mb-4">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${
                i < correctCount
                  ? 'bg-gold-400 text-royal-900'
                  : 'bg-parchment-200 text-parchment-400'
              }`}
            >
              {i < correctCount ? '★' : '☆'}
            </motion.div>
          ))}
        </div>

        <p className="font-display text-3xl font-black text-royal-800 mb-2">
          {correctCount} / {total}
        </p>
        <p className="text-base text-royal-600 mb-6">
          {correctCount === total
            ? 'ممتاز! إجابات كاملة! 🌟'
            : correctCount >= total * 0.7
            ? 'أحسنت! رحلة رائعة! 🎉'
            : 'أنت في الطريق الصحيح! 💪'}
        </p>

        <button
          onClick={onComplete}
          className="w-full py-3 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
        >
          شاهد شاشتك النهائية 🎉
        </button>
      </motion.div>
    </motion.div>
  );
}
