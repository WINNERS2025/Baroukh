import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pause, Play, Square, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  startNarration,
  stopNarration,
  pauseNarration,
  resumeNarration,
  setStatusCallback,
  isSpeechSupported,
  type NarrationStatus,
} from '@/utils/speech';

interface VoiceButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function VoiceButton({ text, label = '🔊 اسمع القصة', className = '' }: VoiceButtonProps) {
  const [status, setStatus] = useState<NarrationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const playRequestRef = useRef(false);
  const supported = isSpeechSupported();

  useEffect(() => {
    // Register callback so speech.ts notifies us of state changes
    setStatusCallback((newStatus, err) => {
      setStatus(newStatus);
      if (newStatus === 'error') {
        setErrorMsg(err || '⚠️ حدث خطأ في تشغيل الصوت');
      } else {
        setErrorMsg(null);
      }
      if (newStatus === 'idle' || newStatus === 'stopped' || newStatus === 'completed' || newStatus === 'error') {
        playRequestRef.current = false;
      }
    });

    return () => {
      stopNarration();
      setStatusCallback(() => {});
    };
  }, []);

  const handleClick = () => {
    if (!supported && status === 'idle') {
      setErrorMsg('الصوت غير متاح على هذا المتصفح');
      return;
    }

    if (status === 'idle' || status === 'stopped' || status === 'completed' || status === 'error') {
      // Prevent duplicate play requests
      if (playRequestRef.current) return;
      playRequestRef.current = true;
      setErrorMsg(null);
      startNarration(text);
    } else if (status === 'playing') {
      pauseNarration();
    } else if (status === 'paused') {
      resumeNarration();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopNarration();
    playRequestRef.current = false;
  };

  if (!supported) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-parchment-200 text-parchment-700 font-bold text-sm ${className}`}>
        <Volume2 className="w-4 h-4 opacity-50" />
        الصوت غير متاح على هذا المتصفح
      </div>
    );
  }

  const buttonLabel =
    status === 'loading' ? 'جاري تحضير الصوت...' :
    status === 'playing' ? '⏸️ إيقاف مؤقت' :
    status === 'paused' ? '▶️ كمل' :
    status === 'completed' ? '✓ اكتملت القصة' :
    status === 'error' ? '▶️ تشغيل' :
    label;

  const statusText =
    status === 'loading' ? '⏳ جاري تحضير الصوت...' :
    status === 'playing' ? '🎙️ جاري تشغيل القصة...' :
    status === 'paused' ? '⏸️ متوقف مؤقتًا' :
    status === 'stopped' ? '⏹️ تم الإيقاف' :
    status === 'completed' ? '✓ اكتملت القصة' :
    status === 'error' ? (errorMsg || '⚠️ حدث خطأ في تشغيل الصوت') :
    null;

  const buttonClass =
    status === 'playing'
      ? 'bg-clay-500 text-white shadow-lg'
      : status === 'paused'
      ? 'bg-gold-500 text-royal-900 shadow-md hover:bg-gold-600'
      : status === 'loading'
      ? 'bg-gold-300 text-royal-800 shadow-md cursor-wait'
      : status === 'error'
      ? 'bg-clay-400 text-white shadow-md hover:bg-clay-500'
      : 'bg-gold-400 text-royal-900 shadow-md hover:bg-gold-500';

  const isInteractive = status !== 'loading';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={isInteractive ? { scale: 1.05 } : {}}
          whileTap={isInteractive ? { scale: 0.95 } : {}}
          onClick={handleClick}
          disabled={status === 'loading'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all focus:outline-none focus:ring-4 focus:ring-gold-300 ${buttonClass} ${className}`}
          aria-label={buttonLabel}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.span
                key="loading"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                {buttonLabel}
              </motion.span>
            ) : status === 'playing' ? (
              <motion.span
                key="playing"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Volume2 className="w-4 h-4" />
                </motion.span>
                {buttonLabel}
              </motion.span>
            ) : status === 'paused' ? (
              <motion.span
                key="paused"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                {buttonLabel}
              </motion.span>
            ) : status === 'completed' ? (
              <motion.span
                key="completed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {buttonLabel}
              </motion.span>
            ) : status === 'error' ? (
              <motion.span
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {buttonLabel}
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                {buttonLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {(status === 'playing' || status === 'paused') && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-clay-400 text-white shadow-md hover:bg-clay-500 transition-colors focus:outline-none focus:ring-2 focus:ring-clay-300"
            aria-label="إيقاف"
          >
            <Square className="w-4 h-4 fill-current" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {statusText && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs font-semibold ${
              status === 'error' ? 'text-clay-600' : 'text-royal-600'
            }`}
          >
            {statusText}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
