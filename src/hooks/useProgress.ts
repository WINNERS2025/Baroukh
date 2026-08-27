import { useCallback, useEffect, useState } from 'react';
import { getDb } from '@/lib/db';

const STORAGE_KEY = 'baruch-journey-progress-v2';

export interface JourneyProgress {
  completedStations: number[];
  stationStars: Record<number, number>;
  unlockedBadges: string[];
  unlockedInventory: number[];
  finalCompleted: boolean;
  teacherMode: boolean;
  allUnlocked: boolean;
}

const defaultProgress: JourneyProgress = {
  completedStations: [],
  stationStars: {},
  unlockedBadges: [],
  unlockedInventory: [],
  finalCompleted: false,
  teacherMode: false,
  allUnlocked: false,
};

// --- localStorage helpers (fallback / instant load) ---

function loadFromLocalStorage(): JourneyProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<JourneyProgress>;
    return {
      completedStations: parsed.completedStations ?? [],
      stationStars: parsed.stationStars ?? {},
      unlockedBadges: parsed.unlockedBadges ?? [],
      unlockedInventory: parsed.unlockedInventory ?? [],
      finalCompleted: parsed.finalCompleted ?? false,
      teacherMode: parsed.teacherMode ?? false,
      allUnlocked: parsed.allUnlocked ?? false,
    };
  } catch {
    return defaultProgress;
  }
}

function saveToLocalStorage(data: JourneyProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// --- PGlite helpers ---

interface DbProgressRow {
  completed_stations: number[];
  station_stars: Record<string, number>;
  unlocked_badges: string[];
  unlocked_inventory: number[];
  final_completed: boolean;
  teacher_mode: boolean;
  all_unlocked: boolean;
}

function rowToProgress(row: DbProgressRow): JourneyProgress {
  const stationStars: Record<number, number> = {};
  for (const [k, v] of Object.entries(row.station_stars ?? {})) {
    stationStars[Number(k)] = v;
  }
  return {
    completedStations: row.completed_stations ?? [],
    stationStars,
    unlockedBadges: row.unlocked_badges ?? [],
    unlockedInventory: row.unlocked_inventory ?? [],
    finalCompleted: row.final_completed ?? false,
    teacherMode: row.teacher_mode ?? false,
    allUnlocked: row.all_unlocked ?? false,
  };
}

async function loadFromDb(): Promise<JourneyProgress | null> {
  try {
    const db = await getDb();
    const result = await db.query<DbProgressRow>(
      'SELECT completed_stations, station_stars, unlocked_badges, unlocked_inventory, final_completed, teacher_mode, all_unlocked FROM journey_progress WHERE id = 1'
    );
    if (result.rows.length === 0) return null;
    return rowToProgress(result.rows[0]);
  } catch {
    return null;
  }
}

async function saveToDb(data: JourneyProgress) {
  try {
    const db = await getDb();
    await db.query(
      `UPDATE journey_progress SET
        completed_stations = $1,
        station_stars = $2::jsonb,
        unlocked_badges = $3,
        unlocked_inventory = $4,
        final_completed = $5,
        teacher_mode = $6,
        all_unlocked = $7,
        updated_at = now()
      WHERE id = 1`,
      [
        data.completedStations,
        JSON.stringify(data.stationStars),
        data.unlockedBadges,
        data.unlockedInventory,
        data.finalCompleted,
        data.teacherMode,
        data.allUnlocked,
      ]
    );

    // Also sync station_scores table
    for (const stationId of [1, 2, 3, 4, 5, 6, 7]) {
      const stars = data.stationStars[stationId] ?? 0;
      const completed = data.completedStations.includes(stationId);
      await db.query(
        `INSERT INTO station_scores (station_id, stars, completed, updated_at)
         VALUES ($1, $2, $3, now())
         ON CONFLICT (station_id) DO UPDATE SET
           stars = GREATEST(station_scores.stars, EXCLUDED.stars),
           completed = EXCLUDED.completed,
           updated_at = now()`,
        [stationId, stars, completed]
      );
    }
  } catch {
    // DB not ready — localStorage is the fallback
  }
}

// --- Hook ---

export function useProgress() {
  const [progress, setProgress] = useState<JourneyProgress>(defaultProgress);
  const [dbReady, setDbReady] = useState(false);

  // Load from localStorage instantly, then hydrate from DB
  useEffect(() => {
    const local = loadFromLocalStorage();
    setProgress(local);

    (async () => {
      const dbData = await loadFromDb();
      if (dbData) {
        setProgress(dbData);
        saveToLocalStorage(dbData);
      } else {
        // First visit — seed DB from localStorage
        await saveToDb(local);
      }
      setDbReady(true);
    })();
  }, []);

  const update = useCallback((updater: (prev: JourneyProgress) => JourneyProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveToLocalStorage(next);
      if (dbReady) saveToDb(next);
      return next;
    });
  }, [dbReady]);

  const completeStation = useCallback(
    (stationId: number, stars: number) => {
      update((prev) => {
        const completed = prev.completedStations.includes(stationId)
          ? prev.completedStations
          : [...prev.completedStations, stationId];
        const prevStars = prev.stationStars[stationId] ?? 0;
        const stationStars = {
          ...prev.stationStars,
          [stationId]: Math.max(prevStars, stars),
        };
        const badgeId = `badge${stationId}`;
        const unlockedBadges = prev.unlockedBadges.includes(badgeId)
          ? prev.unlockedBadges
          : [...prev.unlockedBadges, badgeId];
        const unlockedInventory = prev.unlockedInventory.includes(stationId)
          ? prev.unlockedInventory
          : [...prev.unlockedInventory, stationId];
        return {
          ...prev,
          completedStations: completed,
          stationStars,
          unlockedBadges,
          unlockedInventory,
        };
      });
    },
    [update]
  );

  const completeFinal = useCallback(() => {
    update((prev) => {
      const unlockedBadges = prev.unlockedBadges.includes('badgeFinal')
        ? prev.unlockedBadges
        : [...prev.unlockedBadges, 'badgeFinal'];
      return { ...prev, finalCompleted: true, unlockedBadges };
    });
  }, [update]);

  const setAllUnlocked = useCallback(
    (value: boolean) => {
      update((prev) => ({ ...prev, allUnlocked: value }));
    },
    [update]
  );

  const setTeacherMode = useCallback(
    (value: boolean) => {
      update((prev) => ({ ...prev, teacherMode: value }));
    },
    [update]
  );

  const resetProgress = useCallback(() => {
    update(() => ({ ...defaultProgress, teacherMode: progress.teacherMode }));
  }, [update, progress.teacherMode]);

  const resetStars = useCallback(() => {
    update((prev) => ({ ...prev, stationStars: {} }));
  }, [update]);

  const unlockAllBadges = useCallback(() => {
    update((prev) => ({
      ...prev,
      unlockedBadges: [
        'badge1', 'badge2', 'badge3', 'badge4',
        'badge5', 'badge6', 'badge7', 'badgeFinal',
      ],
    }));
  }, [update]);

  const totalStars = Object.values(progress.stationStars).reduce((a, b) => a + b, 0);

  return {
    progress,
    completeStation,
    completeFinal,
    setAllUnlocked,
    setTeacherMode,
    resetProgress,
    resetStars,
    unlockAllBadges,
    totalStars,
  };
}
