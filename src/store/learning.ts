import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";

export interface LastLesson {
  courseId: string;
  courseUrl: string;
  courseName: string;
  lessonIndex: number;
  lessonTitle: string;
  thumbnailUrl?: string;
  visitedAt: string;
}

interface LearningState {
  /** ISO dates (YYYY-MM-DD) on which the student studied */
  activeDays: string[];
  /** Number of lessons completed per ISO date */
  lessonsByDay: Record<string, number>;
  weeklyGoal: number;
  lastLesson: LastLesson | null;
  recordVisit: (lesson: Omit<LastLesson, "visitedAt">) => void;
  recordLessonCompleted: () => void;
  setWeeklyGoal: (goal: number) => void;
}

const MAX_TRACKED_DAYS = 120;

export const toDayKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDay = (days: string[], key: string): string[] => {
  if (days.includes(key)) {
    return days;
  }
  return [...days, key].sort().slice(-MAX_TRACKED_DAYS);
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      activeDays: [],
      lessonsByDay: {},
      weeklyGoal: 3,
      lastLesson: null,

      recordVisit: (lesson) => {
        const today = toDayKey(new Date());
        set((state) => ({
          activeDays: addDay(state.activeDays, today),
          lastLesson: { ...lesson, visitedAt: new Date().toISOString() },
        }));
      },

      recordLessonCompleted: () => {
        const today = toDayKey(new Date());
        set((state) => ({
          activeDays: addDay(state.activeDays, today),
          lessonsByDay: {
            ...state.lessonsByDay,
            [today]: (state.lessonsByDay[today] ?? 0) + 1,
          },
        }));
      },

      setWeeklyGoal: (goal) => set({ weeklyGoal: Math.min(Math.max(goal, 1), 30) }),
    }),
    {
      name: "benaa-learning-activity",
      storage: createJSONStorage(() => createSafeStorage()),
    }
  )
);

/** Consecutive study days ending today (or yesterday, so the streak isn't lost mid-day). */
export const computeStreak = (activeDays: string[]): number => {
  const set = new Set(activeDays);
  const cursor = new Date();
  if (!set.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (set.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

/** Last 7 days (oldest → newest) with lesson counts. */
export const getLastSevenDays = (
  activeDays: string[],
  lessonsByDay: Record<string, number>
): { key: string; label: string; active: boolean; lessons: number }[] => {
  const labels = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  const set = new Set(activeDays);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = toDayKey(date);
    return {
      key,
      label: labels[date.getDay()],
      active: set.has(key),
      lessons: lessonsByDay[key] ?? 0,
    };
  });
};
