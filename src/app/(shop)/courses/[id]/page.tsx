"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "@/store/course";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { CourseDetailsContent } from "./CourseDetailsContent";
import { CourseSidebar } from "./CourseSidebar";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { currentCourse, isLoading, error, getPublicCourseById, clearCurrentCourse } = useCourseStore();

  useEffect(() => {
    if (id) {
      getPublicCourseById(id as string);
    }
    return () => clearCurrentCourse();
  }, [id, getPublicCourseById, clearCurrentCourse]);

  if (isLoading && !currentCourse) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4 text-right" dir="rtl">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
        <p className="text-brand-primary font-extrabold animate-pulse uppercase tracking-[0.2em] text-sm">
          جاري تحميل الدورة...
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
          {error || "لم نتمكن من العثور على الدورة التي تبحث عنها. ربما تم نقلها أو حذفها."}
        </p>
        <Link
          href="/courses"
          className="px-8 py-3 bg-brand-primary text-white font-extrabold rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/10"
        >
          العودة إلى الكتالوج
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-text-primary relative overflow-x-hidden pt-20" dir="rtl">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 lg:order-1">
            <CourseDetailsContent course={currentCourse!} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="sticky top-28">
              <CourseSidebar course={currentCourse!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}