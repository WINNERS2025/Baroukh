import { PGlite } from '@electric-sql/pglite';

let dbInstance: PGlite | null = null;
let initPromise: Promise<PGlite> | null = null;

export async function getDb(): Promise<PGlite> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = new PGlite('idb://baruch-journey');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS journey_progress (
        id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        completed_stations integer[] NOT NULL DEFAULT '{}',
        station_stars jsonb NOT NULL DEFAULT '{}'::jsonb,
        unlocked_badges text[] NOT NULL DEFAULT '{}',
        unlocked_inventory integer[] NOT NULL DEFAULT '{}',
        final_completed boolean NOT NULL DEFAULT false,
        teacher_mode boolean NOT NULL DEFAULT false,
        all_unlocked boolean NOT NULL DEFAULT false,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS station_scores (
        station_id integer PRIMARY KEY CHECK (station_id BETWEEN 1 AND 7),
        stars integer NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
        completed boolean NOT NULL DEFAULT false,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      INSERT INTO journey_progress (id) VALUES (1)
        ON CONFLICT (id) DO NOTHING;
    `);

    dbInstance = db;
    return db;
  })();

  return initPromise;
}
