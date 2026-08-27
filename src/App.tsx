import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Map as MapIcon, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { stations, MAX_TOTAL_STARS } from '@/data/stations';
import { badges, TOTAL_BADGES } from '@/data/badges';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import { AdventureMap } from '@/components/AdventureMap';
import { ProgressBar } from '@/components/ProgressBar';
import { FinalChallenge } from '@/components/FinalChallenge';
import { BadgeModal } from '@/components/BadgeModal';
import { InventoryBag } from '@/components/InventoryBag';
import { TeacherMode } from '@/components/TeacherMode';
import { EasterEggModal } from '@/components/EasterEggModal';
import { OpeningExperience, JOURNEY_INTRO_STEPS } from '@/components/OpeningExperience';
import { PresentationControls } from '@/components/PresentationControls';
import { StationTransition } from '@/components/StationTransition';
import { StationEnvironment } from '@/components/StationEnvironment';
import { ProfessorCharacter } from '@/components/ProfessorCharacter';
import { XPDisplay } from '@/components/XPDisplay';
import { AchievementCard } from '@/components/AchievementCard';
import { StoryImage } from '@/components/StoryImage';
import { VoiceButton } from '@/components/VoiceButton';
import { GameCard } from '@/components/GameCard';
import type { Badge } from '@/data/badges';
import type { SoundType } from '@/hooks/useSound';
import { getEndingTier } from '@/data/questions';
import {
  station1Narration,
  station2Narration,
  station3Narration,
  station4Narration,
  station5Narration,
  station6Narration,
  station7Narration,
} from '@/data/storyNarrations';
import { Station1 } from '@/stations/Station1';
import { Station2 } from '@/stations/Station2';
import { Station3 } from '@/stations/Station3';
import { Station4 } from '@/stations/Station4';
import { Station5 } from '@/stations/Station5';
import { Station6 } from '@/stations/Station6';
import { Station7 } from '@/stations/Station7';

type PresentationView =
  | 'opening'
  | 'journey-intro'
  | 'map'
  | 'station'
  | 'transition'
  | 'final-challenge'
  | 'final-screen';

type StationPhase =
  | 'intro'
  | 'story-visual'
  | 'explanation'
  | 'interactive'
  | 'game'
  | 'reward';

const stationNarrations: Record<number, string> = {
  1: station1Narration,
  2: station2Narration,
  3: station3Narration,
  4: station4Narration,
  5: station5Narration,
  6: station6Narration,
  7: station7Narration,
};

const professorPoses: Record<number, 'hold-scroll' | 'hold-book' | 'point' | 'look-ahead' | 'welcome'> = {
  1: 'hold-scroll',
  2: 'look-ahead',
  3: 'point',
  4: 'hold-book',
  5: 'look-ahead',
  6: 'point',
  7: 'hold-scroll',
};

export default function App() {
  const {
    progress,
    completeStation,
    completeFinal,
    setAllUnlocked,
    setTeacherMode,
    resetProgress,
    resetStars,
    unlockAllBadges,
    totalStars,
  } = useProgress();
  const { enabled: soundEnabled, toggle: toggleSound, effectsEnabled, toggleEffects, play } = useSound();

  // --- Presentation state ---
  const [view, setView] = useState<PresentationView>('opening');
  const [journeyIntroStep, setJourneyIntroStep] = useState(0);
  const [currentStation, setCurrentStation] = useState(1);
  const [stationPhase, setStationPhase] = useState<StationPhase>('intro');
  const [transitionFrom, setTransitionFrom] = useState(1);
  const [transitionTo, setTransitionTo] = useState(2);
  const [presentationMode, setPresentationMode] = useState(false);
  const [badgeToShow, setBadgeToShow] = useState<Badge | null>(null);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [stationCompleteToast, setStationCompleteToast] = useState(false);
  const [stationStars, setStationStars] = useState<number>(0);
  const [showReward, setShowReward] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [mapRevealStep, setMapRevealStep] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [videoPlaySignal, setVideoPlaySignal] = useState(0);

  const completedCount = progress.completedStations.length;
  const finalUnlocked = completedCount === stations.length;
  const badgeCount = progress.unlockedBadges.length;

  // --- Keyboard navigation ---
  const handleNext = useCallback(() => {
    if (view === 'journey-intro') {
      if (journeyIntroStep < JOURNEY_INTRO_STEPS.length) {
        setJourneyIntroStep((s) => s + 1);
        play('click');
      } else {
        // All intro steps done -> go directly to Station 1 (no second map)
        setCurrentStation(1);
        setStationPhase('intro');
        setView('station');
        play('click');
      }
    } else if (view === 'map') {
      if (mapRevealStep < 8) {
        setMapRevealStep((s) => Math.min(s + 1, 8));
        play('click');
      } else {
        // All stations revealed -> enter the first incomplete station
        const nextStationId = findNextStation(progress.completedStations);
        if (nextStationId) {
          setCurrentStation(nextStationId);
          setStationPhase('intro');
          setView('station');
          play('click');
        } else if (finalUnlocked) {
          setView('final-challenge');
          play('click');
        }
      }
    } else if (view === 'transition') {
      // Presenter controls when to enter the next station
      setCurrentStation(transitionTo);
      setStationPhase('intro');
      setGameCompleted(false);
      setShowReward(false);
      setView('station');
      play('click');
      return;
    } else if (view === 'station') {
      if (stationPhase === 'game' && !gameCompleted) {
        // Game in progress — presenter cannot advance until game is done
        return;
      }
      if (stationPhase === 'intro') {
        setStationPhase('story-visual');
        play('click');
      } else if (stationPhase === 'story-visual') {
        setStationPhase('explanation');
        play('click');
      } else if (stationPhase === 'explanation') {
        setStationPhase('interactive');
        play('click');
      } else if (stationPhase === 'interactive') {
        setStationPhase('game');
        play('click');
      } else if (stationPhase === 'reward') {
        // After reward, go to transition (presenter-controlled)
        if (currentStation < 7) {
          setTransitionFrom(currentStation);
          setTransitionTo(currentStation + 1);
          setView('transition');
          play('click');
        } else {
          // Last station done -> final challenge
          setView('final-challenge');
          play('click');
        }
      }
      // 'game' phase: presenter presses →/space only after game is completed
    }
  }, [view, journeyIntroStep, stationPhase, currentStation, progress.completedStations, finalUnlocked, play, mapRevealStep, gameCompleted, transitionTo]);

  const handlePrev = useCallback(() => {
    if (view === 'journey-intro') {
      if (journeyIntroStep > 0) {
        setJourneyIntroStep((s) => s - 1);
        play('click');
      } else {
        // Back to opening video from first journey step
        setView('opening');
        play('click');
      }
    } else if (view === 'map') {
      if (mapRevealStep > 0) {
        setMapRevealStep((s) => s - 1);
        play('click');
      } else {
        setView('journey-intro');
        play('click');
      }
    } else if (view === 'transition') {
      // Go back to the previous station's reward screen
      setView('station');
      setStationPhase('reward');
      play('click');
      return;
    } else if (view === 'station') {
      if (stationPhase === 'game') {
        // Can't go back during an active game
        return;
      } else if (stationPhase === 'interactive') {
        setStationPhase('explanation');
        play('click');
      } else if (stationPhase === 'explanation') {
        setStationPhase('story-visual');
        play('click');
      } else if (stationPhase === 'story-visual') {
        setStationPhase('intro');
        play('click');
      } else if (stationPhase === 'intro') {
        // Go back to map — all stations already revealed
        setMapRevealStep(8);
        setView('map');
        play('click');
      }
    } else if (view === 'final-challenge') {
      // FinalChallenge handles its own keyboard navigation internally
      return;
    }
  }, [view, stationPhase, play, mapRevealStep]);

  // Global keyboard listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      // Keyboard control begins ONLY after the opening video ends.
      if (view === 'opening') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setPresentationMode((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKey, { passive: false });
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, view]);

  // --- Station completion handler ---
  const handleStationComplete = useCallback((stationId: number, stars: number) => {
    const wasAlreadyCompleted = progress.completedStations.includes(stationId);
    completeStation(stationId, stars);
    setStationStars(stars);
    setShowReward(true);
    setGameCompleted(true);
    play('star');

    const badge = badges.find((b) => b.stationId === stationId);
    if (badge && !progress.unlockedBadges.includes(badge.id)) {
      setTimeout(() => play('badge'), 500);
      setBadgeToShow(badge);
    }

    if (!wasAlreadyCompleted) {
      setTimeout(() => play('complete'), 300);
      setStationCompleteToast(true);
      setTimeout(() => setStationCompleteToast(false), 2500);
    }
  }, [progress.completedStations, progress.unlockedBadges, completeStation, play]);

  // --- Final challenge completion ---
  const handleFinalComplete = useCallback(() => {
    completeFinal();
    play('finalCelebration');
    setView('final-screen');
  }, [completeFinal, play]);

  // --- Reset ---
  const handleReset = useCallback(() => {
    resetProgress();
    setView('opening');
    setJourneyIntroStep(0);
    setCurrentStation(1);
    setStationPhase('intro');
    setMapRevealStep(0);
  }, [resetProgress]);

  // --- Station selection from map (mouse fallback) ---
  const handleSelectStation = useCallback((id: number) => {
    play('click');
    setCurrentStation(id);
    setStationPhase('intro');
    setGameCompleted(false);
    setShowReward(false);
    setView('station');
  }, [play]);

  const handleMapNext = useCallback(() => {
    setMapRevealStep((s) => Math.min(s + 1, 8));
    play('click');
  }, [play]);

  const handleMapPrev = useCallback(() => {
    setMapRevealStep((s) => Math.max(s - 1, 0));
    play('click');
  }, [play]);

  // --- Transition complete ---
  const handleTransitionComplete = useCallback(() => {
    setCurrentStation(transitionTo);
    setStationPhase('intro');
    setGameCompleted(false);
    setShowReward(false);
    setView('station');
    play('click');
  }, [transitionTo, play]);

  // When entering map from final-challenge back button, show all stations
  // (handled inline in handlePrev where final-challenge -> map sets nothing extra,
  //  but mapRevealStep persists from before)

  // --- Render station game ---
  const renderStationGame = (id: number) => {
    const playFn = play as (type: SoundType) => void;
    const onComplete = (stars: number) => {
      handleStationComplete(id, stars);
      setStationPhase('reward');
    };

    // 'interactive' phase: station starts at its cinematic intro (magic/sos/etc.)
    // 'game' phase: station starts at the actual game
    const interactiveStartPhases: Record<number, string> = {
      1: 'magic',
      2: 'magic',
      3: 'sos',
      4: 'paths',
      5: 'intro',
      6: 'sunrise',
      7: 'test',
    };
    const gameStartPhases: Record<number, string> = {
      1: 'game',
      2: 'game',
      3: 'order',
      4: 'puzzle',
      5: 'game',
      6: 'game',
      7: 'sort',
    };

    let startPhase: string;
    if (stationPhase === 'interactive') {
      startPhase = interactiveStartPhases[id] ?? 'intro';
    } else if (stationPhase === 'game') {
      startPhase = gameStartPhases[id] ?? 'game';
    } else {
      startPhase = 'intro';
    }

    switch (id) {
      case 1: return <Station1 onComplete={onComplete} onBack={() => { setMapRevealStep(8); setView('map'); }} play={playFn} startPhase={startPhase} presenterMode />;
      case 2: return <Station2 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      case 3: return <Station3 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      case 4: return <Station4 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      case 5: return <Station5 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      case 6: return <Station6 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      case 7: return <Station7 onComplete={onComplete} play={playFn} startPhase={startPhase} presenterMode />;
      default: return null;
    }
  };

  // --- Render station view ---
  const renderStation = () => {
    const station = stations.find((s) => s.id === currentStation)!;
    const sStars = progress.stationStars[currentStation] ?? 0;
    const darkStation = [2, 3, 4, 5, 7].includes(currentStation);
    const headerIconColor = darkStation ? 'text-amber-100' : 'text-royal-700';
    const headerBtnClass = darkStation
      ? 'bg-white/15 hover:bg-white/25 border border-white/20'
      : 'bg-white/60 hover:bg-white/80';
    const hintTextColor = darkStation ? 'text-amber-100/60' : 'text-royal-600/70';

    return (
      <StationEnvironment stationId={currentStation}>
        {/* Header */}
        <div className={`sticky top-0 z-40 ${presentationMode ? 'bg-transparent' : darkStation ? 'bg-black/30 backdrop-blur-md border-b-2 border-white/10' : 'bg-white/40 backdrop-blur-md border-b-2 border-white/20'}`}>
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!presentationMode && (
                <button
                  onClick={() => { play('click'); setMapRevealStep(8); setView('map'); }}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-gold-300 ${headerBtnClass}`}
                  aria-label="العودة للخريطة"
                >
                  <MapIcon className={`w-5 h-5 ${headerIconColor}`} />
                </button>
              )}
              <div>
                <h2 className="font-display text-xl md:text-2xl font-black text-current leading-tight">
                  {station.icon} {station.title}
                </h2>
                <p className="text-sm font-semibold opacity-80">{station.chapter}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XPDisplay
                totalStars={totalStars}
                stationStars={progress.stationStars}
                presentationMode={presentationMode}
              />
              {!presentationMode && (
                <button
                  onClick={() => { play('click'); toggleSound(); }}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-gold-300 ${headerBtnClass}`}
                  aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                >
                  {soundEnabled ? <Volume2 className={`w-5 h-5 ${headerIconColor}`} /> : <VolumeX className={`w-5 h-5 ${headerIconColor}`} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Professor character — silent visual guide, bottom-right, never covers content */}
        <div className={`fixed pointer-events-none z-20 transition-all ${presentationMode ? 'bottom-4 right-4 opacity-60' : 'bottom-20 right-4'}`}>
          <ProfessorCharacter stationId={currentStation} pose={professorPoses[currentStation]} size="sm" />
        </div>

        {/* Phase indicator */}
        {!presentationMode && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {(['intro', 'story-visual', 'explanation', 'interactive', 'game', 'reward'] as StationPhase[]).map((p) => (
              <div
                key={p}
                className={`w-3 h-3 rounded-full transition-all ${stationPhase === p ? 'bg-gold-400 scale-125' : p === 'reward' && showReward ? 'bg-sage-400' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* 1. Station introduction */}
            {stationPhase === 'intro' && (
              <motion.div
                key="station-intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 150 }}
                  className="text-8xl md:text-9xl"
                >
                  {station.icon}
                </motion.div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-black mb-2">{station.title}</h1>
                  <p className="text-xl font-bold opacity-80">{station.chapter}</p>
                </div>
                <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed opacity-90">
                  {station.description}
                </p>
                <PresenterHint />
              </motion.div>
            )}

            {/* 2. Story visual */}
            {stationPhase === 'story-visual' && (
              <motion.div
                key="station-story-visual"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="text-7xl md:text-8xl"
                >
                  {station.icon}
                </motion.div>
                <StoryImage stationId={currentStation} />
                <PresenterHint />
              </motion.div>
            )}

            {/* 3. Presenter explanation moment */}
            {stationPhase === 'explanation' && (
              <motion.div
                key="station-explanation"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <GameCard>
                  <p className="font-display text-2xl font-bold text-royal-800 text-center mb-4">
                    {station.challengeTitle}
                  </p>
                  <p className="text-lg text-royal-700 leading-relaxed text-center mb-4">
                    {stationNarrations[currentStation] ?? station.description}
                  </p>
                  <div className="flex justify-center mb-2">
                    <VoiceButton text={stationNarrations[currentStation] ?? station.description} />
                  </div>
                </GameCard>
                <div className="mt-4">
                  <PresenterHint />
                </div>
              </motion.div>
            )}

            {/* 4. Interactive visual (cinematic animation) */}
            {stationPhase === 'interactive' && (
              <motion.div
                key="station-interactive"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {renderStationGame(currentStation)}
                <div className="mt-4">
                  <PresenterHint />
                </div>
              </motion.div>
            )}

            {/* 5. Station game */}
            {stationPhase === 'game' && (
              <motion.div
                key="station-game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {renderStationGame(currentStation)}
                {!gameCompleted && (
                  <div className="text-center mt-4">
                    <p className={`text-sm font-semibold ${hintTextColor}`}>
                      أكمل اللعبة للمتابعة...
                    </p>
                  </div>
                )}
                {gameCompleted && (
                  <div className="text-center mt-4">
                    <PresenterHint />
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. Game completion / 7. XP reward */}
            {stationPhase === 'reward' && showReward && (
              <motion.div
                key="station-reward"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-7xl"
                >
                  🎉
                </motion.div>
                <h2 className="font-display text-3xl font-black">
                  أحسنت! اكتملت المحطة {currentStation}
                </h2>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ scale: 0, y: -40 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 0.2 + s * 0.15, type: 'spring' }}
                      className="text-4xl"
                    >
                      {s <= stationStars ? '⭐' : '☆'}
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg opacity-80">
                  حصلت على {stationStars * 10} XP ومجموع {totalStars + stationStars * 10} XP
                </p>
                <PresenterHint />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Inventory bag — hidden in presentation mode but popups still show */}
        <InventoryBag unlockedInventory={progress.unlockedInventory} presentationMode={presentationMode} />
      </StationEnvironment>
    );
  };

  // --- Render map view ---
  const renderMap = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen bg-parchment-texture ${presentationMode ? 'pt-0' : ''}`}
      >
        {!presentationMode && (
          <header className="sticky top-0 z-40 bg-parchment-50/90 backdrop-blur-md border-b-2 border-parchment-200 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-7 h-7 text-royal-600" />
                  <div>
                    <h1 className="font-display text-xl md:text-2xl font-black text-royal-900 leading-tight">
                      🗺️ رحلة سفر باروخ
                    </h1>
                    <p className="text-sm text-parchment-700 font-semibold">من الحزن إلى الرجاء</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XPDisplay totalStars={totalStars} stationStars={progress.stationStars} />
                  <button
                    onClick={() => { play('click'); toggleSound(); }}
                    className="p-2 rounded-full bg-parchment-200 hover:bg-parchment-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gold-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5 text-royal-700" /> : <VolumeX className="w-5 h-5 text-royal-700" />}
                  </button>
                </div>
              </div>
              <ProgressBar
                completed={completedCount}
                total={stations.length}
                totalStars={totalStars}
                maxStars={MAX_TOTAL_STARS}
                badgeCount={badgeCount}
                maxBadges={TOTAL_BADGES}
              />
            </div>
          </header>
        )}

        <main className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-parchment border-4 border-parchment-200">
            <AdventureMap
              completedStations={progress.completedStations}
              stationStars={progress.stationStars}
              allUnlocked={progress.allUnlocked}
              onSelectStation={handleSelectStation}
              onStartJourney={() => handleSelectStation(1)}
              finalUnlocked={finalUnlocked}
              onFinalChallenge={() => { play('click'); setView('final-challenge'); }}
              onEasterEgg={() => { play('click'); setEasterEggOpen(true); }}
              revealStep={mapRevealStep}
              onNext={handleMapNext}
              onPrev={handleMapPrev}
            />
          </div>

          {progress.finalCompleted && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => { play('click'); setView('final-screen'); }}
                className="px-8 py-3 rounded-full bg-gradient-to-l from-gold-400 to-gold-600 text-royal-900 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gold-300"
              >
                شاهد شاشتك النهائية 🎉
              </button>
            </div>
          )}

          {/* Presenter hint */}
          <div className="text-center mt-6">
            <p className="text-sm text-royal-600/70 font-semibold">
              ← السابق | مسافة / السهم الأيمن للتالي →
            </p>
          </div>
        </main>

        <InventoryBag unlockedInventory={progress.unlockedInventory} presentationMode={presentationMode} />
        {!presentationMode && (
          <TeacherMode
            teacherMode={progress.teacherMode}
            allUnlocked={progress.allUnlocked}
            soundEnabled={soundEnabled}
            effectsEnabled={effectsEnabled}
            onToggleTeacherMode={(v) => setTeacherMode(v)}
            onUnlockAll={() => { play('unlock'); setAllUnlocked(true); }}
            onLockAll={() => setAllUnlocked(false)}
            onResetJourney={() => { resetProgress(); setView('opening'); setJourneyIntroStep(0); setMapRevealStep(0); }}
            onResetStars={resetStars}
            onUnlockAllBadges={() => { play('badge'); unlockAllBadges(); }}
            onToggleSound={() => { play('click'); toggleSound(); }}
            onToggleEffects={() => { play('click'); toggleEffects(); }}
          />
        )}
      </motion.div>
    );
  };

  // --- Render final screen with AchievementCard ---
  const renderFinalScreen = () => {
    const finalStars = Math.min(Math.round((finalScore / 10) * 5), 5);
    const tier = getEndingTier(finalScore);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${
          finalScore >= 8
            ? 'bg-gradient-to-b from-gold-200 via-amber-100 to-gold-300'
            : finalScore >= 5
            ? 'bg-gradient-to-b from-amber-100 via-parchment-100 to-gold-100'
            : 'bg-gradient-to-b from-sky-100 via-parchment-100 to-amber-50'
        }`}
      >
        {/* Confetti — more for higher scores */}
        {Array.from({ length: finalScore >= 8 ? 50 : 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            initial={{ x: '50%', y: '0%', opacity: 1, rotate: 0 }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              rotate: Math.random() * 720,
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
          >
            {['🎉', '⭐', '✨', '🌟', '💫', '🎊', '👑'][i % 7]}
          </motion.div>
        ))}

        {/* Light rays for high score */}
        {finalScore >= 8 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: '50%', top: '40%', width: 4, height: 400,
                  transformOrigin: 'top center',
                  transform: `rotate(${i * 45}deg)`,
                  background: 'linear-gradient(to bottom, rgba(255,210,100,0.15), transparent)',
                }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 w-full max-w-2xl">
          {/* Cinematic ending reveal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={finalScore >= 8 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-2"
              style={{ filter: finalScore >= 8 ? 'drop-shadow(0 0 30px rgba(255,200,80,0.6))' : 'none' }}
            >
              {tier.emoji}
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl font-black text-royal-900 mb-2"
            >
              {tier.emoji} {tier.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-display text-lg text-royal-700 mb-2"
            >
              {tier.message}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-display text-xl text-royal-600"
            >
              لقد أنهيت رحلة سفر باروخ!
            </motion.p>
          </motion.div>

          <AchievementCard
            totalStars={totalStars}
            stationStars={progress.stationStars}
            badgeCount={badgeCount}
            finalStars={finalStars}
            onReset={handleReset}
            tierTitle={tier.title}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment-texture overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'opening' && (
          <OpeningExperience
            key="opening"
            mode="video"
            playSignal={videoPlaySignal}
            onComplete={() => {
              setView('journey-intro');
              setJourneyIntroStep(0);
            }}
          />
        )}

        {view === 'journey-intro' && (
          <OpeningExperience
            key="journey-intro"
            mode="journey"
            onComplete={() => {
              setCurrentStation(1);
              setStationPhase('intro');
              setView('station');
            }}
            manualStep={journeyIntroStep}
          />
        )}

        {view === 'map' && renderMap()}

        {view === 'station' && (
          <motion.div
            key={`station-${currentStation}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderStation()}
          </motion.div>
        )}

        {view === 'transition' && (
          <StationTransition
            key="transition"
            fromStation={transitionFrom}
            toStation={transitionTo}
            onComplete={handleTransitionComplete}
            play={play}
          />
        )}

        {view === 'final-challenge' && (
          <FinalChallenge
            key="final-challenge"
            onComplete={handleFinalComplete}
            onBack={() => { play('click'); setView('map'); }}
            play={play}
            onScoreChange={setFinalScore}
          />
        )}

        {view === 'final-screen' && (
          <div key="final-screen">{renderFinalScreen()}</div>
        )}
      </AnimatePresence>

      {/* Presentation controls overlay */}
      <PresentationControls
        presentationMode={presentationMode}
        onTogglePresentationMode={() => {
          if (view === 'opening') {
            setVideoPlaySignal((s) => s + 1);
          } else {
            setPresentationMode((p) => !p);
          }
        }}
        showHint={view !== 'opening' && view !== 'journey-intro'}
      />

      {/* Badge modal */}
      <BadgeModal badge={badgeToShow} onClose={() => setBadgeToShow(null)} />

      {/* Easter egg modal */}
      <EasterEggModal
        open={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
        onReset={handleReset}
      />

      {/* Station complete toast */}
      <AnimatePresence>
        {stationCompleteToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[55] bg-gradient-to-l from-sage-500 to-sage-600 text-white font-display text-lg font-bold px-6 py-3 rounded-full shadow-2xl border-2 border-white"
          >
            محطة جديدة اكتملت! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper: find next station to enter ---
function findNextStation(completed: number[]): number {
  for (let i = 1; i <= 7; i++) {
    if (!completed.includes(i)) return i;
  }
  return 0;
}

// --- Helper: presenter hint ---
function PresenterHint() {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-royal-100/80 border border-royal-200">
        <ChevronLeft className="w-4 h-4 text-royal-600" />
        <span className="text-xs font-semibold text-royal-600">السابق</span>
      </div>
      <span className="text-xs font-semibold text-royal-500/60">|</span>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-100/80 border border-gold-300 animate-pulse">
        <span className="text-xs font-semibold text-gold-700">التالي</span>
        <ChevronRight className="w-4 h-4 text-gold-700" />
        <span className="text-[10px] text-gold-600/70">/ مسافة</span>
      </div>
    </div>
  );
}
