"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  BookOpen,
  Trophy,
  Target,
  PlayCircle,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Loader2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import type { Course } from "@/store/course";
import {
  useLearningStore,
  computeStreak,
  getLastSevenDays,
} from "@/store/learning";

/* ---------------------------------- helpers --------------------------------- */

const getCourseProgress = (course: Course): number => {
  const total = course.course_data?.length ?? 0;
  const done = course.completedVideos?.length ?? 0;
  if (typeof course.progress === "number" && course.progress > 0) {
    return Math.min(100, Math.round(course.progress));
  }
  if (total === 0) {
    return 0;
  }
  return Math.min(100, Math.round((done / total) * 100));
};

/** Estimated watched seconds = completed ratio × total course length */
const getWatchedSeconds = (course: Course): number => {
  const totalSeconds = (course.course_data ?? []).reduce(
    (acc, lesson) => acc + (lesson.video_length || 0),
    0
  );
  return Math.round((getCourseProgress(course) / 100) * totalSeconds);
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes} د`;
  }
  return `${hours} س ${minutes} د`;
};

/* -------------------------------- sub-components ---------------------------- */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: string;
}

function StatCard({ icon, label, value, hint, accent }: StatCardProps) {
  return (
    <article className="bg-surface border border-border/40 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-text-secondary">{label}</p>
        <p className="text-2xl font-black text-text-primary leading-tight">{value}</p>
        <p className="text-[11px] text-text-secondary/80 truncate">{hint}</p>
      </div>
    </article>
  );
}

interface GoalRingProps {
  done: number;
  goal: number;
}

function GoalRing({ done, goal }: GoalRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(done / goal, 1);
  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} strokeWidth="10" className="stroke-border/40 fill-none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="stroke-brand-primary fill-none transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-text-primary">{done}</span>
        <span className="text-[11px] font-bold text-text-secondary">من {goal} دروس</span>
      </div>
    </div>
  );
}

interface Badge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <li
      className={`p-4 rounded-2xl border text-center transition-all ${badge.unlocked
        ? "bg-amber-500/10 border-amber-500/30"
        : "bg-background/60 border-border/30 opacity-60"
        }`}
    >
      <div
        className={`w-11 h-11 mx-auto mb-2 rounded-full flex items-center justify-center ${badge.unlocked ? "bg-amber-500 text-white" : "bg-border/40 text-text-secondary"
          }`}
      >
        {badge.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
      </div>
      <p className="text-xs font-black text-text-primary">{badge.title}</p>
      <p className="text-[10px] text-text-secondary mt-0.5">{badge.description}</p>
      <span className="sr-only">{badge.unlocked ? "مفتوح" : "مقفل"}</span>
    </li>
  );
}

function CourseProgressRow({ course }: { course: Course }) {
  const progress = getCourseProgress(course);
  const isDone = progress >= 100;
  return (
    <li>
      <Link
        href={`/my-courses/${course.url || course.id}`}
        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-background/70 transition-colors"
      >
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-background shrink-0">
          {course.thumbnail?.url ? (
            <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <BookOpen className="w-5 h-5 m-auto mt-3.5 text-text-secondary/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-sm font-bold text-text-primary truncate">{course.name}</p>
            <span className={`text-xs font-black shrink-0 ${isDone ? "text-emerald-600" : "text-brand-primary"}`}>
              {isDone ? "مكتمل ✓" : `${progress}%`}
            </span>
          </div>
          <div
            className="h-2 rounded-full bg-border/40 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`تقدم ${course.name}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${isDone ? "bg-emerald-500" : "bg-brand-primary"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Link>
    </li>
  );
}

/* ----------------------------------- page ----------------------------------- */

export default function LearningDashboardPage() {
  const { token, user, isAuthenticated } = useAuthStore();
  const { enrolledCourses, isLoading, getEnrolledCourses } = useCourseStore();
  const { activeDays, lessonsByDay, weeklyGoal, lastLesson, setWeeklyGoal } = useLearningStore();

  // Avoid hydration mismatch: persisted local data only exists on the client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      getEnrolledCourses(token);
    }
  }, [token, getEnrolledCourses]);

  const streak = useMemo(() => computeStreak(activeDays), [activeDays]);
  const week = useMemo(() => getLastSevenDays(activeDays, lessonsByDay), [activeDays, lessonsByDay]);
  const lessonsThisWeek = week.reduce((acc, d) => acc + d.lessons, 0);

  const stats = useMemo(() => {
    const totalLessonsDone = enrolledCourses.reduce((acc, c) => acc + (c.completedVideos?.length ?? 0), 0);
    const watchedSeconds = enrolledCourses.reduce((acc, c) => acc + getWatchedSeconds(c), 0);
    const completedCourses = enrolledCourses.filter((c) => getCourseProgress(c) >= 100).length;
    const inProgress = enrolledCourses
      .filter((c) => getCourseProgress(c) < 100)
      .sort((a, b) => getCourseProgress(b) - getCourseProgress(a));
    return { totalLessonsDone, watchedSeconds, completedCourses, inProgress };
  }, [enrolledCourses]);

  const badges: Badge[] = useMemo(
    () => [
      { id: "first-lesson", title: "الخطوة الأولى", description: "أكمل أول درس", unlocked: stats.totalLessonsDone >= 1 },
      { id: "streak-3", title: "مثابر", description: "3 أيام متتالية", unlocked: streak >= 3 },
      { id: "lessons-10", title: "متعلم نشيط", description: "أكمل 10 دروس", unlocked: stats.totalLessonsDone >= 10 },
      { id: "first-course", title: "خريج أسس", description: "أنهِ دورة كاملة", unlocked: stats.completedCourses >= 1 },
      { id: "streak-7", title: "أسبوع ذهبي", description: "7 أيام متتالية", unlocked: streak >= 7 },
      { id: "goal", title: "محقق الأهداف", description: "حقق هدفك الأسبوعي", unlocked: lessonsThisWeek >= weeklyGoal },
    ],
    [stats, streak, lessonsThisWeek, weeklyGoal]
  );

  const handleGoalDecrease = () => setWeeklyGoal(weeklyGoal - 1);
  const handleGoalIncrease = () => setWeeklyGoal(weeklyGoal + 1);

  if (!isAuthenticated) {
    return (
      <section className="max-w-md mx-auto px-4 py-32 text-center space-y-4" dir="rtl">
        <GraduationCap className="w-14 h-14 mx-auto text-brand-primary" />
        <h1 className="text-2xl font-black">لوحة التعلم الخاصة بك</h1>
        <p className="text-sm text-text-secondary">سجّل الدخول لمتابعة تقدمك وسلسلة أيام الدراسة.</p>
        <Link href="/login" className="inline-block px-8 py-3 bg-brand-primary text-white rounded-xl font-bold">
          تسجيل الدخول
        </Link>
      </section>
    );
  }

  const showSkeleton = !isMounted || (isLoading && enrolledCourses.length === 0);

  return (
    <div className="min-h-screen bg-background text-text-primary pt-24 pb-20" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>لوحة التعلم</span>
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              أهلاً {user?.first_name ?? ""}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {streak > 0
                ? `رائع! أنت تدرس منذ ${streak} ${streak === 1 ? "يوم" : "أيام"} متتالية، حافظ على السلسلة.`
                : "ابدأ درساً اليوم لتشعل سلسلة أيام الدراسة"}
            </p>
          </div>
          <Link
            href="/my-courses"
            className="text-sm font-bold text-brand-primary hover:underline w-fit"
          >
            عرض جميع دوراتي ←
          </Link>
        </header>

        {showSkeleton ? (
          <div className="flex items-center justify-center py-24" aria-live="polite">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            <span className="sr-only">جاري التحميل</span>
          </div>
        ) : (
          <>
            {/* Resume card */}
            {lastLesson && (
              <section
                aria-label="متابعة آخر درس"
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-brand-primary to-[#5e2a4c] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl"
              >
                {lastLesson.thumbnailUrl && (
                  <img
                    src={lastLesson.thumbnailUrl}
                    alt=""
                    className="w-full sm:w-44 h-28 object-cover rounded-2xl border border-white/20"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white/70">تابع من حيث توقفت</p>
                  <h2 className="text-xl font-black truncate mt-1">{lastLesson.courseName}</h2>
                  <p className="text-sm text-white/80 truncate mt-0.5">
                    الدرس {lastLesson.lessonIndex + 1}: {lastLesson.lessonTitle}
                  </p>
                </div>
                <Link
                  href={`/my-courses/${lastLesson.courseUrl}?section=${lastLesson.lessonIndex}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-brand-primary font-black text-sm hover:scale-105 transition-transform shrink-0"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>استئناف الدرس</span>
                </Link>
              </section>
            )}

            {/* Stats */}
            <section aria-label="إحصائيات التعلم" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Flame className="w-6 h-6" />}
                label="سلسلة الأيام"
                value={`${streak}`}
                hint={streak > 0 ? "أيام متتالية 🔥" : "ابدأ اليوم"}
                accent="bg-orange-500/15 text-orange-500"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="وقت التعلم"
                value={formatDuration(stats.watchedSeconds)}
                hint="تقدير من الدروس المكتملة"
                accent="bg-sky-500/15 text-sky-500"
              />
              <StatCard
                icon={<CheckCircle2 className="w-6 h-6" />}
                label="دروس مكتملة"
                value={`${stats.totalLessonsDone}`}
                hint={`في ${enrolledCourses.length} دورات`}
                accent="bg-emerald-500/15 text-emerald-600"
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                label="دورات منجزة"
                value={`${stats.completedCourses}`}
                hint="بنسبة 100%"
                accent="bg-amber-500/15 text-amber-500"
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly goal + activity */}
              <section
                aria-label="الهدف الأسبوعي"
                className="lg:col-span-5 bg-surface border border-border/40 rounded-[2rem] p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-primary" />
                    <span>الهدف الأسبوعي</span>
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGoalDecrease}
                      disabled={weeklyGoal <= 1}
                      aria-label="تقليل الهدف"
                      className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center hover:border-brand-primary disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black" aria-live="polite">{weeklyGoal}</span>
                    <button
                      type="button"
                      onClick={handleGoalIncrease}
                      disabled={weeklyGoal >= 30}
                      aria-label="زيادة الهدف"
                      className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center hover:border-brand-primary disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <GoalRing done={lessonsThisWeek} goal={weeklyGoal} />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {lessonsThisWeek >= weeklyGoal
                      ? "أحسنت! حققت هدفك لهذا الأسبوع."
                      : `باقي ${weeklyGoal - lessonsThisWeek} دروس لتحقيق هدفك خلال آخر 7 أيام.`}
                  </p>
                </div>

                {/* 7-day activity strip */}
                <div>
                  <p className="text-xs font-bold text-text-secondary mb-2">نشاط آخر 7 أيام</p>
                  <ol className="grid grid-cols-7 gap-1.5">
                    {week.map((day) => (
                      <li key={day.key} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-black ${day.active ? "bg-brand-primary text-white" : "bg-background border border-border/40 text-text-secondary/50"
                            }`}
                          title={`${day.lessons} دروس`}
                        >
                          {day.active ? <Flame className="w-4 h-4" /> : "·"}
                        </div>
                        <span className="text-[10px] text-text-secondary">{day.label}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* In-progress courses */}
              <section
                aria-label="الدورات قيد التقدم"
                className="lg:col-span-7 bg-surface border border-border/40 rounded-[2rem] p-6"
              >
                <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                  <span>تقدمك في الدورات</span>
                </h2>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-sm text-text-secondary">لم تشترك في أي دورة بعد.</p>
                    <Link href="/courses" className="inline-block px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold">
                      استكشف الدورات
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/20">
                    {[...stats.inProgress, ...enrolledCourses.filter((c) => getCourseProgress(c) >= 100)].map((course) => (
                      <CourseProgressRow key={course.id} course={course} />
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Achievements */}
            <section aria-label="الإنجازات" className="bg-surface border border-border/40 rounded-[2rem] p-6">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>الإنجازات</span>
                <span className="text-xs font-bold text-text-secondary">
                  ({badges.filter((b) => b.unlocked).length}/{badges.length})
                </span>
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
