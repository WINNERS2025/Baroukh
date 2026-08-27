// Web Audio API sound effects - generates pleasant sounds programmatically
// No audio files needed; all sounds are synthesized at runtime.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  // Resume if suspended (browsers require user interaction)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
): void {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const startTime = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playChord(freqs: number[], duration: number, type: OscillatorType = 'sine', volume = 0.2, delay = 0): void {
  freqs.forEach((f) => playTone(f, duration, type, volume, delay));
}

// --- Sound effect functions ---

export function playCorrect(): void {
  // Happy ascending chime: C5, E5, G5
  playTone(523.25, 0.15, 'sine', 0.25, 0);
  playTone(659.25, 0.15, 'sine', 0.25, 0.1);
  playTone(783.99, 0.3, 'sine', 0.3, 0.2);
}

export function playWrong(): void {
  // Gentle descending tone - not harsh
  playTone(392, 0.2, 'sine', 0.15, 0);
  playTone(311.13, 0.3, 'sine', 0.15, 0.12);
}

export function playStar(): void {
  // Magical sparkle: high ascending arpeggio
  playTone(1046.5, 0.1, 'triangle', 0.2, 0);
  playTone(1318.51, 0.1, 'triangle', 0.2, 0.08);
  playTone(1567.98, 0.1, 'triangle', 0.2, 0.16);
  playTone(2093, 0.25, 'triangle', 0.25, 0.24);
}

export function playBadge(): void {
  // Celebration fanfare
  playChord([523.25, 659.25, 783.99], 0.2, 'sine', 0.15, 0);
  playChord([587.33, 698.46, 880], 0.2, 'sine', 0.15, 0.15);
  playChord([659.25, 783.99, 987.77], 0.4, 'sine', 0.2, 0.3);
}

export function playClick(): void {
  playTone(800, 0.05, 'sine', 0.1, 0);
}

export function playComplete(): void {
  // Station complete jingle
  playTone(523.25, 0.12, 'sine', 0.2, 0);
  playTone(659.25, 0.12, 'sine', 0.2, 0.1);
  playTone(783.99, 0.12, 'sine', 0.2, 0.2);
  playTone(1046.5, 0.3, 'sine', 0.25, 0.3);
}

export function playUnlock(): void {
  // Unlock sound: rising sweep
  playTone(440, 0.1, 'sine', 0.2, 0);
  playTone(554.37, 0.1, 'sine', 0.2, 0.08);
  playTone(659.25, 0.2, 'sine', 0.25, 0.16);
}

export function playTransition(): void {
  // Cinematic whoosh: low sweep + shimmer
  playTone(200, 0.4, 'sine', 0.15, 0);
  playTone(300, 0.35, 'sine', 0.12, 0.1);
  playTone(450, 0.3, 'sine', 0.1, 0.2);
  playTone(800, 0.15, 'triangle', 0.08, 0.3);
  playTone(1200, 0.1, 'triangle', 0.06, 0.35);
}

export function playFinalCelebration(): void {
  // Big celebration
  playChord([523.25, 659.25, 783.99, 1046.5], 0.5, 'sine', 0.2, 0);
  playChord([587.33, 698.46, 880, 1174.66], 0.5, 'sine', 0.2, 0.2);
  playChord([659.25, 783.99, 987.77, 1318.51], 0.6, 'sine', 0.25, 0.4);
}

// Initialize audio context on first user interaction
export function initAudio(): void {
  getCtx();
}
