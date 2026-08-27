import { useCallback, useEffect, useRef, useState } from 'react';
import {
  playCorrect,
  playWrong,
  playStar,
  playBadge,
  playClick,
  playComplete,
  playUnlock,
  playFinalCelebration,
  playTransition,
  initAudio,
} from '@/utils/sounds';

const SOUND_KEY = 'baruch-sound-enabled';
const EFFECTS_KEY = 'baruch-effects-enabled';

export type SoundType =
  | 'correct'
  | 'wrong'
  | 'star'
  | 'badge'
  | 'click'
  | 'complete'
  | 'unlock'
  | 'finalCelebration'
  | 'transition';

export function useSound() {
  const [enabled, setEnabled] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const enabledRef = useRef(true);
  const effectsRef = useRef(true);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(SOUND_KEY);
      if (s !== null) {
        const val = s === 'true';
        setEnabled(val);
        enabledRef.current = val;
      }
      const e = window.localStorage.getItem(EFFECTS_KEY);
      if (e !== null) {
        const val = e === 'true';
        setEffectsEnabled(val);
        effectsRef.current = val;
      }
    } catch {
      // ignore
    }
  }, []);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handler = () => {
      initAudio();
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('pointerdown', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      try {
        window.localStorage.setItem(SOUND_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleEffects = useCallback(() => {
    setEffectsEnabled((prev) => {
      const next = !prev;
      effectsRef.current = next;
      try {
        window.localStorage.setItem(EFFECTS_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    switch (type) {
      case 'correct':
        playCorrect();
        break;
      case 'wrong':
        playWrong();
        break;
      case 'star':
        playStar();
        break;
      case 'badge':
        playBadge();
        break;
      case 'click':
        playClick();
        break;
      case 'complete':
        playComplete();
        break;
      case 'unlock':
        playUnlock();
        break;
      case 'finalCelebration':
        playFinalCelebration();
        break;
      case 'transition':
        playTransition();
        break;
    }
  }, []);

  return { enabled, toggle, effectsEnabled, toggleEffects, play };
}
