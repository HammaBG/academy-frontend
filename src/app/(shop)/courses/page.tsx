"use client";

import { useEffect, Suspense } from "react";
import { useCourseStore } from "@/store/course";
import { BookOpen, Star, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/app/(shop)/CourseCard";

function CoursesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category");

  const { courses, isLoading, getPublicCourses } = useCourseStore();

  useEffect(() => {
    getPublicCourses();
  }, [getPublicCourses]);

  const filteredCourses = selectedCategory
    ? courses.filter(course => course.categories === selectedCategory)
    : courses;

  return (
    <div className="min-h-screen bg-[#1a0e16] text-white" dir="rtl">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#8b3d6f]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black">
            استكشف <span className="text-[#fbad26]">دوراتنا</span>
          </h1>
          {selectedCategory ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-zinc-400 font-medium">
                عرض النتائج للتصنيف: <span className="text-[#fbad26] font-black uppercase tracking-wider">{selectedCategory}</span>
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all border border-white/5"
              >
                إزالة التصفية
              </button>
            </div>
          ) : (
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
              انضم إلى آلاف الطلاب وابدأ رحلتك اليوم مع مناهجنا المصممة بشكل احترافي.
            </p>
          )}
        </div>

        {isLoading && courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">جاري فتح الكتالوج...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {courses.length === 0 && !isLoading && (
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <BookOpen className="w-16 h-16 text-white/5 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">لا توجد دورات متاحة حالياً</h3>
            <p className="text-zinc-500 text-sm">تحقق مرة أخرى لاحقاً للحصول على محتوى تعليمي جديد.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#1a0e16] text-white" dir="rtl">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#8b3d6f]/10 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">جاري فتح الكتالوج...</p>
        </div>
      </div>
    </div>
  );
}

export default function CoursesListPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CoursesListContent />
    </Suspense>
  );
}
