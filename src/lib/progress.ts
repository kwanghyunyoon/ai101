/*
 * The Learner's Progress: which Lessons they have finished, a "N of 6 done"
 * summary, and where to resume. Read and written through a `StoragePort` — real
 * `localStorage` in the browser, an in-memory fake in tests — so the module's
 * logic is exercised with no DOM and no real storage.
 *
 * ADR 0001: Progress lives only in the Learner's browser and losing it is
 * harmless. A missing, empty, or corrupt stored value therefore reads as
 * "nothing complete" and never throws.
 */

/** A tiny string key/value store. The one seam between Progress and the browser. */
export interface StoragePort {
  read(key: string): string | null;
  write(key: string, value: string): void;
}

/** The single key the Progress record is stored under. */
export const PROGRESS_STORAGE_KEY = "ai101:progress";

/** Where the Learner should pick the Course back up. */
export type ResumePoint =
  | { kind: "lesson"; lessonId: string; index: number }
  | { kind: "complete" };

export interface ProgressSummary {
  done: number;
  total: number;
}

/**
 * A `StoragePort` backed by `window.localStorage`, with every access guarded so
 * private-mode or disabled storage degrades to "nothing persisted" rather than
 * throwing.
 */
export function localStoragePort(): StoragePort {
  return {
    read(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* storage unavailable — the record just does not persist */
      }
    },
  };
}

/** An in-memory `StoragePort` for tests. `seed` pre-loads stored values. */
export function memoryStoragePort(seed?: Record<string, string>): StoragePort {
  const map = new Map<string, string>(Object.entries(seed ?? {}));
  return {
    read: (key) => map.get(key) ?? null,
    write: (key, value) => {
      map.set(key, value);
    },
  };
}

/**
 * The Progress record over a `StoragePort`. Constructed with the Lesson ids in
 * teaching order; every query is answered against that order.
 */
export class Progress {
  constructor(
    private readonly port: StoragePort,
    private readonly lessonIds: readonly string[],
  ) {}

  private load(): Set<string> {
    const known = new Set(this.lessonIds);
    let raw: string | null;
    try {
      raw = this.port.read(PROGRESS_STORAGE_KEY);
    } catch {
      return new Set();
    }
    if (!raw) return new Set();
    try {
      const parsed: unknown = JSON.parse(raw);
      const list: unknown[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as { completed?: unknown })?.completed)
          ? (parsed as { completed: unknown[] }).completed
          : [];
      return new Set(
        list.filter(
          (id): id is string => typeof id === "string" && known.has(id),
        ),
      );
    } catch {
      return new Set();
    }
  }

  private persist(done: Set<string>): void {
    // Store in teaching order so the value stays stable and readable.
    const ordered = this.lessonIds.filter((id) => done.has(id));
    this.port.write(PROGRESS_STORAGE_KEY, JSON.stringify({ completed: ordered }));
  }

  /** Total number of Lessons in the Course. */
  get total(): number {
    return this.lessonIds.length;
  }

  isComplete(lessonId: string): boolean {
    return this.load().has(lessonId);
  }

  /** The completed Lesson ids, in teaching order. */
  completedLessonIds(): string[] {
    const done = this.load();
    return this.lessonIds.filter((id) => done.has(id));
  }

  completedCount(): number {
    return this.load().size;
  }

  summary(): ProgressSummary {
    return { done: this.completedCount(), total: this.total };
  }

  allComplete(): boolean {
    return this.total > 0 && this.completedCount() === this.total;
  }

  /** Mark a Lesson complete. Idempotent; an unknown id is ignored. */
  markComplete(lessonId: string): void {
    if (!this.lessonIds.includes(lessonId)) return;
    const done = this.load();
    if (done.has(lessonId)) return;
    done.add(lessonId);
    this.persist(done);
  }

  /** The first incomplete Lesson in teaching order, or the completion screen. */
  resumePoint(): ResumePoint {
    const done = this.load();
    for (let i = 0; i < this.lessonIds.length; i++) {
      if (!done.has(this.lessonIds[i])) {
        return { kind: "lesson", lessonId: this.lessonIds[i], index: i };
      }
    }
    return { kind: "complete" };
  }

  /**
   * Where the end-of-Lesson action goes after `lessonId`: the next Lesson in
   * order, or the completion screen when `lessonId` is the last one.
   */
  nextAfter(lessonId: string): ResumePoint {
    const i = this.lessonIds.indexOf(lessonId);
    if (i >= 0 && i + 1 < this.lessonIds.length) {
      return { kind: "lesson", lessonId: this.lessonIds[i + 1], index: i + 1 };
    }
    return { kind: "complete" };
  }
}
