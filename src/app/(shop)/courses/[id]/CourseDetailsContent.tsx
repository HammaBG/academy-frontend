"use client";

import { Course } from "@/store/course";
import {
  Star,
  Users,
  BookOpen,
  Clock,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  Info,
  User,
  MessageSquare,
  Globe,
  Sparkles,
  Layers,
  Award,
  ShieldCheck,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CoursePlayer } from "@/components/CoursePlayer";
import { CourseSidebar } from "./CourseSidebar";

interface CourseDetailsContentProps {
  course: Course;
}

export function CourseDetailsContent({ course }: CourseDetailsContentProps) {
  const [openSections, setOpenSections] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const categoryColor = course.category_color || "#F95353";

  const toggleSection = (idx: number) => {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAllSections = () => {
    const total = course.course_data?.length || 0;
    if (openSections.length === total) {
      setOpenSections([]);
    } else {
      setOpenSections(Array.from({ length: total }, (_, i) => i));
    }
  };

  const allSectionsOpen = openSections.length === (course.course_data?.length || 0);

  return (
    <div className="space-y-10 text-right" dir="rtl">
      {/* 1. Video Preview / Teaser Player */}
      <section aria-label="معاينة الدورة" className="relative group">
        <div className="relative aspect-video rounded-[24px] sm:rounded-[32px] overflow-hidden border border-border/60 group-hover:border-brand-primary/40 shadow-2xl bg-surface transition-all duration-300">
          {isPlaying && course.demo_url ? (
            <CoursePlayer videoUrl={course.demo_url} />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="w-full h-full cursor-pointer relative"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsPlaying(true);
                }
              }}
              aria-label="تشغيل مقدمة الدورة"
            >
              {course.thumbnail?.url ? (
                <img
                  src={course.thumbnail.url}
                  alt={course.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-text-secondary/20" />
                </div>
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 group-hover:via-black/20 transition-all flex items-center justify-center">
                {/* Pulsing Play Button */}
                <div className="relative">
                  <span className="absolute -inset-2 rounded-full bg-brand-primary/30 animate-ping" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary hover:bg-brand-primary/90 rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform text-white">
                    <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Preview Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none">
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white text-xs sm:text-sm font-bold flex items-center gap-2">
                  <span>معاينة مجانية لمقدمة الدورة</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Course Header & Value Proposition */}
      <section aria-label="معلومات الدورة" className="space-y-6">
        {/* Categories & Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {course.categories.split(",").map((cat, i) => (
            <span
              key={i}
              className="px-3.5 py-1 text-white text-xs font-black rounded-full shadow-sm"
              style={{ backgroundColor: categoryColor }}
            >
              {cat.trim()}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/20">
            <Globe className="w-3.5 h-3.5" />
            دورة أونلاين 100%
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black leading-[1.25] text-text-primary">
          {course.name}
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
          {course.short_description}
        </p>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-border/40 text-text-secondary text-xs sm:text-sm">
          {/* Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "w-4 h-4 fill-current",
                    s > (course.ratings || 0) && "opacity-25"
                  )}
                />
              ))}
            </div>
            <span className="font-black text-text-primary">({course.ratings || 0})</span>
            {course.reviews?.length ? (
              <span className="text-text-secondary text-xs">({course.reviews.length} تقييم)</span>
            ) : null}
          </div>

          {/* Students */}
          <div className="flex items-center gap-1.5 font-bold">
            <Users className="w-4 h-4 text-brand-primary" />
            <span>{course.purchased || 0} طالب مسجل</span>
          </div>

          {/* Updated Date */}
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span>
              تم التحديث{" "}
              {course.created_at
                ? new Date(course.created_at).toLocaleDateString("ar-EG")
                : "مؤخراً"}
            </span>
          </div>

          {/* Instructor Quick Pill */}
          {course.creator && (
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs overflow-hidden border border-brand-primary/20">
                {course.creator.avatar_url ? (
                  <img src={course.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                )}
              </div>
              <span>بإشراف: {course.creator.first_name} {course.creator.last_name || ""}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Mobile-Only Course Sidebar (Prominent CTA directly below header on mobile) */}
      <div className="block lg:hidden">
        <CourseSidebar course={course} />
      </div>

      {/* 4. What You'll Learn (ماذا ستتعلم) */}
      {course.benefits && course.benefits.length > 0 && (
        <section aria-label="ماذا ستتعلم" className="bg-surface/80 backdrop-blur-md rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-border/50 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">ماذا ستتعلم في هذه الدورة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-background/50 border border-border/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-text-primary font-bold text-sm leading-relaxed">{benefit.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Course Curriculum / Syllabus (محتوى الدورة) */}
      <section aria-label="محتوى الدورة" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">محتوى ومنهاج الدورة</h2>
              <p className="text-xs text-text-secondary font-bold">
                {course.course_data?.length || 0} أقسام تدريبية شاملة
              </p>
            </div>
          </div>

          {course.course_data && course.course_data.length > 0 && (
            <button
              onClick={toggleAllSections}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand-primary/5 transition-colors"
            >
              {allSectionsOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" /> طي جميع الأقسام
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> توسيع جميع الأقسام
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-3.5">
          {course.course_data?.map((section, idx) => {
            const isOpen = openSections.includes(idx);
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden bg-surface transition-all duration-300",
                  isOpen ? "border-brand-primary/40 shadow-sm" : "border-border/40 hover:border-border/70"
                )}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-surface/90 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">
                          القسم {idx + 1}
                        </span>
                        <h3 className="font-black text-sm sm:text-base text-text-primary">
                          {section.video_section}
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary font-medium mt-1">{section.title}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-text-secondary transition-transform duration-300 shrink-0",
                      isOpen && "rotate-180 text-brand-primary"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-border/40 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-text-secondary text-sm leading-relaxed text-right font-medium">
                      {section.description}
                    </p>
                    <div className="p-3.5 bg-background rounded-xl border border-border/40 flex items-center justify-between">
                      <span className="text-xs font-black text-brand-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        دروس بجودة عالية مع دعم للملاحظات الذكية
                      </span>
                      <span className="text-xs font-bold text-text-secondary">فيديو مسجل</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Course Full Description (نبذة وتفاصيل الدورة) */}
      <section aria-label="نبذة عن الدورة" className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary">نبذة تفصيلية عن الدورة</h2>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm rounded-[28px] p-6 sm:p-8 border border-border/40 text-text-secondary font-medium leading-[1.9] text-base space-y-4">
          {course.description.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* 7. Prerequisites (المتطلبات الأساسية) */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <section aria-label="المتطلبات الأساسية" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">المتطلبات الأساسية</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.prerequisites.map((pre, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border/40">
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span className="text-sm font-bold text-text-secondary">{pre.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Instructor Section (عن المحاضر) */}
      <section aria-label="عن المحاضر" className="pt-6 border-t border-border/40 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary">عن المحاضر</h2>
        </div>

        <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-border/40 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start text-center md:text-right shadow-sm">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-background border-2 border-brand-primary/20 shrink-0 overflow-hidden shadow-lg relative group">
            {course.creator?.avatar_url ? (
              <img
                src={course.creator.avatar_url}
                alt={`${course.creator.first_name} ${course.creator.last_name || ""}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-text-primary">
                {course.creator?.first_name} {course.creator?.last_name || "خبير الأكاديمية"}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20 w-fit self-center md:self-auto">
                <Award className="w-3.5 h-3.5" /> مدرب معتمد
              </span>
            </div>
            <p className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">
              {course.creator?.title || "أخصائي محتوى تعليمي أول"}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed font-medium pt-1">
              {course.creator?.bio ||
                "خبير تعليمي يتمتع بخبرة واسعة في المجال، ملتزم بتقديم أفضل المناهج التعليمية التطبيقية ومساعدة الطلاب على إتقان المهارات العملية."}
            </p>
          </div>
        </div>
      </section>

      {/* 9. Reviews Section (تقييمات وآراء الطلاب) */}
      <section aria-label="تقييمات الطلاب" className="pt-6 border-t border-border/40 space-y-6 pb-16">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">تقييمات وآراء الطلاب</h2>
          </div>

          <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-2xl border border-border/40 shadow-sm">
            <span className="text-2xl font-black text-brand-primary">{course.ratings || "5.0"}</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {!course.reviews || course.reviews.length === 0 ? (
          <div className="py-14 text-center bg-surface/40 rounded-[28px] border border-dashed border-border/60 space-y-2">
            <p className="text-text-primary font-black text-base">لا توجد تقييمات مكتوبة حتى الآن</p>
            <p className="text-text-secondary text-xs font-medium">كن أول طالب يشارك تجربته بعد الانضمام للدورة!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {course.reviews.map((review, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-border/40 space-y-3 shadow-sm hover:border-border/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-xs font-black text-text-primary overflow-hidden">
                      {review.user?.avatar ? (
                        <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.user?.name?.[0] || "ط"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-text-primary">{review.user?.name || "طالب الأكاديمية"}</p>
                      <div className="flex text-amber-400 scale-90 origin-right">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("w-3.5 h-3.5 fill-current", s > (review.rating || 0) && "opacity-20")} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed italic text-right">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}