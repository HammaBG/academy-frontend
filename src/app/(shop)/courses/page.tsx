"use client";

import { useEffect, Suspense, FormEvent, useState, ChangeEvent } from "react";
import { useCourseStore } from "@/store/course";
import { BookOpen, Loader2, Sparkles, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/Course/CourseCard";

function CoursesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category");

  const { courses, isLoading, getPublicCourses } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPublicCourses();
  }, [getPublicCourses]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearCategory = () => {
    router.push("/courses");
  };

  const filteredCourses = (courses || []).filter((course) => {
    const matchesCategory = selectedCategory ? course.categories === selectedCategory : true;
    const matchesSearch = searchQuery
      ? course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.short_description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-text-primary text-right" dir="rtl">

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        {/* Header Block */}
        <div className="text-center mb-16 space-y-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary leading-tight">
            استكشف <span className="text-brand-primary">دوراتنا</span> المميزة
          </h1>

          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-sm sm:text-base">
            برامج ودورات رقمية مبنية على أسس علمية في علم النفس والعلاقات والتربية الواعية، لمساعدتك على بناء حياة أسرية أكثر وعياً واستقراراً.
          </p>

          {/* Filters & Search Row */}
          <div className="max-w-2xl mx-auto mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            {/* Search Input */}
            <div className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="ابحث عن الدورات..."
                className="w-full bg-surface border border-border/40 rounded-2xl py-3.5 pr-12 pl-4 text-text-primary placeholder-text-secondary/45 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right text-sm font-semibold"
              />
              <Search className="w-5 h-5 text-text-secondary/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Selected Category Pill */}
            {selectedCategory && (
              <div className="flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/25 rounded-2xl px-4 py-3 shrink-0 text-brand-primary text-sm font-extrabold">
                <span>المسار: {selectedCategory}</span>
                <button
                  onClick={handleClearCategory}
                  className="hover:bg-brand-primary/20 p-1 rounded-full transition-colors"
                  aria-label="إزالة التصفية"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        {isLoading && courses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface/50 rounded-[32px] h-[450px] animate-pulse border border-border/40"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="py-24 text-center bg-surface/30 rounded-[32px] border border-dashed border-border/60">
                <BookOpen className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-secondary">لا توجد دورات متاحة تطابق بحثك</h3>
                <p className="text-text-secondary/60 text-sm mt-1">تحقق مرة أخرى لاحقاً للحصول على محتوى تعليمي جديد.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background text-text-primary text-right" dir="rtl">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
          <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">جاري فتح الكتالوج...</p>
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
