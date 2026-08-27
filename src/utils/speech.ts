// Audio narration system: ElevenLabs TTS via Supabase Edge Function, with browser SpeechSynthesis fallback.
// The API key lives only as a Supabase secret — never in client code.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let resumeTimer: number | null = null;
let mode: 'elevenlabs' | 'browser' | 'none' = 'none';

export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'completed' | 'error';

type StatusCallback = (status: NarrationStatus, errorMsg?: string) => void;
let statusCallback: StatusCallback | null = null;

export function setStatusCallback(cb: StatusCallback): void {
  statusCallback = cb;
}

function notify(status: NarrationStatus, errorMsg?: string): void {
  if (statusCallback) statusCallback(status, errorMsg);
}

function clearResumeTimer(): void {
  if (resumeTimer) {
    clearInterval(resumeTimer);
    resumeTimer = null;
  }
}

// --- Browser TTS helpers (fallback) ---

let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;
  return cachedVoices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
}

function findArabicVoice(): SpeechSynthesisVoice | null {
  if (cachedVoices.length === 0) refreshVoices();
  const arEg = cachedVoices.find((v) => v.lang === 'ar-EG');
  if (arEg) return arEg;
  const anyAr = cachedVoices.find((v) => v.lang.startsWith('ar'));
  if (anyAr) return anyAr;
  return null;
}

// --- Public API ---

export async function startNarration(text: string): Promise<void> {
  // Cancel any existing playback first
  stopNarrationInternal();

  notify('loading');

  try {
    // Try ElevenLabs via Supabase Edge Function (key stays server-side)
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`TTS server returned ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    currentAudio = audio;
    mode = 'elevenlabs';

    audio.onended = () => {
      notify('completed');
      cleanupAudio();
    };

    audio.onerror = () => {
      notify('error', 'فشل تشغيل الصوت');
      cleanupAudio();
    };

    await audio.play();
    notify('playing');
  } catch (err) {
    // Fallback to browser SpeechSynthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      startBrowserTTS(text);
    } else {
      notify('error', 'الصوت غير متاح على هذا المتصفح');
      mode = 'none';
    }
  }
}

function startBrowserTTS(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    notify('error', 'الصوت غير متاح على هذا المتصفح');
    return;
  }

  window.speechSynthesis.cancel();
  clearResumeTimer();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-EG';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = findArabicVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  currentUtterance = utterance;
  mode = 'browser';

  utterance.onend = () => {
    notify('completed');
    clearResumeTimer();
    currentUtterance = null;
  };

  utterance.onerror = (e) => {
    // 'interrupted' or 'canceled' happen when we intentionally stop — don't show error
    if (e.error === 'interrupted' || e.error === 'canceled') {
      return;
    }
    notify('error', 'فشل تشغيل الصوت');
    clearResumeTimer();
    currentUtterance = null;
  };

  window.speechSynthesis.speak(utterance);
  notify('playing');

  // Chrome bug: speech pauses after ~15s. Resume periodically.
  resumeTimer = window.setInterval(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (!window.speechSynthesis.speaking) {
      clearResumeTimer();
    }
  }, 5000);
}

export function pauseNarration(): void {
  if (mode === 'elevenlabs' && currentAudio) {
    currentAudio.pause();
    notify('paused');
  } else if (mode === 'browser' && typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      notify('paused');
    }
  }
}

export function resumeNarration(): void {
  if (mode === 'elevenlabs' && currentAudio) {
    currentAudio.play();
    notify('playing');
  } else if (mode === 'browser' && typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      notify('playing');
    }
  }
}

function cleanupAudio(): void {
  if (currentAudio) {
    const src = currentAudio.src;
    if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    currentAudio = null;
  }
  mode = 'none';
}

function stopNarrationInternal(): void {
  if (currentAudio) {
    currentAudio.pause();
    cleanupAudio();
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  clearResumeTimer();
  currentUtterance = null;
}

export function stopNarration(): void {
  stopNarrationInternal();
  notify('stopped');
}

export function isSpeaking(): boolean {
  if (mode === 'elevenlabs' && currentAudio) return !currentAudio.paused && !currentAudio.ended;
  if (mode === 'browser' && typeof window !== 'undefined' && window.speechSynthesis) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}
