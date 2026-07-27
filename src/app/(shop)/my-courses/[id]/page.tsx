"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { Loader2, AlertCircle, PlayCircle, BookOpen, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CoursePlayer } from "@/components/CoursePlayer";

export default function MyCourseDetailsPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentCourse, isLoading, error, getCourseContent, clearCurrentCourse } = useCourseStore();

  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    if (id && token) {
      getCourseContent(id as string, token);
    }
    return () => clearCurrentCourse();
  }, [id, token, getCourseContent, clearCurrentCourse]);

  if (isLoading && !currentCourse) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4 text-right" dir="rtl">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
        <p className="text-brand-primary font-extrabold animate-pulse uppercase tracking-widest text-sm">
          جاري تحميل محتوى الدورة...
        </p>
      </div>
    );
  }

  if (error || (!currentCourse && !isLoading)) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black mb-2">حدث خطأ ما</h2>
        <p className="text-text-secondary max-w-md mb-8 font-medium">
          {error || "لم نتمكن من تحميل محتوى الدورة. ربما لم تقم بالتسجيل في هذه الدورة."}
        </p>
        <Link
          href="/my-courses"
          className="px-8 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          العودة إلى دوراتي
        </Link>
      </div>
    );
  }

  if (!currentCourse) return null;

  const sections = currentCourse.course_data || [];
  const currentSection = sections[activeIdx];

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const handleNext = () => {
    if (activeIdx < sections.length - 1) {
      setActiveIdx(activeIdx + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-x-hidden pt-24 text-right" dir="rtl">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary font-bold text-sm mb-6 transition-colors"
        >
          <span>العودة إلى دوراتي</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>

        {/* Core LMS Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: Player & Controls */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            {/* Video Box Container */}
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-border/40 bg-surface shadow-2xl">
              {currentSection?.video_url ? (
                <CoursePlayer videoUrl={currentSection.video_url} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary/30 p-8">
                  <PlayCircle className="w-16 h-16 mb-4" />
                  <p className="text-sm font-bold">لا يوجد فيديو متاح لهذا الدرس</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons under the Video Player */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={activeIdx === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-border/40 hover:border-brand-primary/50 disabled:opacity-40 disabled:pointer-events-none text-text-primary text-sm font-extrabold transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>

              <div className="text-xs sm:text-sm font-extrabold text-text-secondary bg-surface px-4 py-2 rounded-xl border border-border/40">
                {activeIdx + 1} / {sections.length}
              </div>

              <button
                onClick={handleNext}
                disabled={activeIdx === sections.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white hover:bg-brand-primary/95 disabled:opacity-40 disabled:pointer-events-none text-sm font-extrabold transition-all shadow-md shadow-brand-primary/10"
              >
                <span>الدرس التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Lesson Description & Links */}
            {currentSection && (
              <div className="bg-surface border border-border/40 rounded-[32px] p-6 space-y-4 shadow-sm">
                <h2 className="text-xl font-black text-text-primary">وصف الدرس: {currentSection.video_section || currentSection.title}</h2>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">{currentSection.description || "لا يوجد وصف إضافي متوفر للدرس الحالي."}</p>

                {currentSection.links && currentSection.links.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold text-text-primary">روابط ومرفقات الدرس:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSection.links.map((link: any, linkIdx: number) => (
                        <a
                          key={linkIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-background hover:bg-surface border border-border/40 hover:border-brand-primary/50 rounded-xl text-xs font-bold text-text-secondary hover:text-brand-primary transition-all"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Course Syllabus & Description */}
          <div className="lg:col-span-5 space-y-6">
            {/* Course Summary Card */}
            <div className="bg-surface border border-border/40 rounded-[32px] p-6 shadow-sm">
              <h1 className="text-2xl font-black text-text-primary mb-2 leading-tight">{currentCourse.name}</h1>
              <p className="text-text-secondary text-sm leading-relaxed font-medium line-clamp-3 mb-4">{currentCourse.short_description}</p>
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2 text-text-secondary">
                  <BookOpen className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs sm:text-sm font-bold">{sections.length} دروس</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs sm:text-sm font-bold">
                    {sections.reduce((acc: number, section: any) => acc + (section.video_length || 0), 0)} ثانية
                  </span>
                </div>
              </div>
            </div>

            {/* Lessons List container */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-text-primary">قائمة الدروس والمقاطع</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {sections.map((section: any, idx: number) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center justify-between border transition-all text-right shadow-sm",
                        isActive
                          ? "bg-brand-primary/10 border-brand-primary/45 text-brand-primary"
                          : "bg-surface border-border/40 text-text-primary hover:border-brand-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          isActive
                            ? "bg-brand-primary text-white border-brand-primary/20"
                            : "bg-background border-border/40 text-text-secondary"
                        )}>
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="truncate text-right">
                          <h3 className="font-extrabold text-sm truncate">{section.video_section || `القسم ${idx + 1}`}</h3>
                          <p className="text-[11px] text-text-secondary truncate">{section.title}</p>
                        </div>
                      </div>
                      {section.video_length && (
                        <span className="text-[10px] font-bold text-text-secondary bg-background px-2.5 py-1 rounded-full border border-border/40 shrink-0">
                          {Math.floor(section.video_length / 60)}:{(section.video_length % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
