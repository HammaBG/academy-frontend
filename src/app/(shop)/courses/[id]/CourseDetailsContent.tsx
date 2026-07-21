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
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CoursePlayer } from "@/components/CoursePlayer";

interface CourseDetailsContentProps {
  course: Course;
}

export function CourseDetailsContent({ course }: CourseDetailsContentProps) {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const categoryColor = course.category_color || "#F95353";

  return (
    <div className="space-y-12 text-right" dir="rtl">
      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {course.categories.split(",").map((cat, i) => (
            <span
              key={i}
              className="px-3.5 py-1 text-white text-xs font-extrabold rounded-full shadow-sm"
              style={{ backgroundColor: categoryColor }}
            >
              {cat.trim()}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight text-text-primary">
          {course.name}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed">
          {course.short_description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/40 text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("w-4 h-4 fill-current", s > (course.ratings || 0) && "opacity-20")} />
              ))}
            </div>
            <span className="text-sm font-bold text-text-primary">({course.ratings || 0})</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-bold">{course.purchased || 0} طالب مسجل</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-bold">تم التحديث {course.created_at ? new Date(course.created_at).toLocaleDateString('ar-EG') : 'مؤخراً'}</span>
          </div>
        </div>
      </div>

      {/* Video Preview / Banner */}
      <div className="relative aspect-video rounded-[32px] overflow-hidden border border-border/40 group shadow-2xl bg-surface">
        {isPlaying && course.demo_url ? (
          <CoursePlayer videoUrl={course.demo_url} />
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="w-full h-full cursor-pointer relative"
          >
            {course.thumbnail?.url ? (
              <img src={course.thumbnail.url} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-text-secondary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:bg-black/20 transition-all">
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform text-white">
                <PlayCircle className="w-10 h-10 ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-border/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-bold text-text-primary text-center">اضغط لمشاهدة مقدمة الدورة</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-3 text-text-primary">
          <Info className="w-6 h-6 text-brand-primary" />
          نبذة عن الدورة
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-secondary font-medium leading-[1.8]">
          {course.description.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>
      </div>

      {/* What you'll learn */}
      <div className="bg-surface backdrop-blur-md rounded-[32px] p-8 border border-border/40 space-y-6 shadow-sm">
        <h2 className="text-2xl font-black text-text-primary">ماذا ستتعلم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.benefits.map((benefit, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-text-primary font-bold text-sm sm:text-base">{benefit.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Syllabus */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-text-primary">محتوى الدورة</h2>
          <span className="text-sm font-bold text-text-secondary">{course.course_data?.length || 0} أقسام</span>
        </div>

        <div className="space-y-4">
          {course.course_data?.map((section, idx) => (
            <div key={idx} className="border border-border/40 rounded-2xl overflow-hidden bg-surface">
              <button
                onClick={() => setOpenSection(openSection === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-surface/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-text-primary">{section.video_section}</h3>
                    <p className="text-xs text-text-secondary font-bold">{section.title}</p>
                  </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-text-secondary transition-transform", openSection === idx && "rotate-180")} />
              </button>
              {openSection === idx && (
                <div className="p-6 pt-0 border-t border-border/40 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-text-secondary text-sm leading-relaxed mb-4 text-right">{section.description}</p>
                  <div className="px-4 py-3 bg-background rounded-xl border border-border/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-primary">معاينة متاحة</span>
                    <span className="text-xs font-bold text-text-secondary">محتوى الفيديو</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-text-primary">المتطلبات الأساسية</h2>
        <ul className="list-disc list-inside space-y-3 text-text-secondary font-bold">
          {course.prerequisites.map((pre, i) => (
            <li key={i}>{pre.title}</li>
          ))}
        </ul>
      </div>

      {/* Instructor Section */}
      <div className="pt-12 border-t border-border/40 space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3 text-text-primary">
          <User className="w-6 h-6 text-brand-primary" />
          عن المحاضر
        </h2>
        <div className="bg-surface p-8 rounded-[32px] border border-border/40 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-right shadow-sm">
          <div className="w-24 h-24 rounded-2xl bg-background border border-border/40 shrink-0 overflow-hidden shadow-lg">
            {course.creator?.avatar_url ? (
              <img src={course.creator.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-black text-text-primary">{course.creator?.first_name} {course.creator?.last_name || "خبير الأكاديمية"}</h3>
            <p className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">{course.creator?.title || "أخصائي محتوى تعليمي أول"}</p>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xl font-medium">
              {course.creator?.bio || "خبير تعليمي يتمتع بأكثر من 10 سنوات من الخبرة في المجال. ملتزم بتقديم محتوى تعليمي عالي الجودة ومساعدة الطلاب في تحقيق أهدافهم المهنية."}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-12 border-t border-border/40 space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 text-text-primary">
            <MessageSquare className="w-6 h-6 text-brand-primary" />
            تقييمات الطلاب
          </h2>
          <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-xl border border-border/40 shadow-sm">
            <span className="text-2xl font-black text-brand-primary">{course.ratings || "0.0"}</span>
            <div className="flex text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {(!course.reviews || course.reviews.length === 0) ? (
          <div className="py-20 text-center bg-surface/30 rounded-[32px] border border-dashed border-border/60">
            <p className="text-text-secondary font-bold">لا توجد تقييمات حتى الآن. كن أول من يشارك رأيك!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.reviews.map((review, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-border/40 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border/40 flex items-center justify-center text-xs font-black text-text-primary">
                    {review.user?.avatar ? <img src={review.user.avatar} className="rounded-lg" /> : review.user?.name?.[0] || 'ط'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-text-primary">{review.user?.name || "طالب"}</p>
                    <div className="flex text-yellow-500 scale-75 origin-right">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-3 h-3 fill-current", s > (review.rating || 0) && "opacity-20")} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary font-medium leading-relaxed italic text-right">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}