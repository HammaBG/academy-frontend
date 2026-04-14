"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "@/store/course";
import { Loader2, AlertCircle } from "lucide-react";
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
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
        <p className="text-[#fbad26] font-bold animate-pulse uppercase tracking-[0.2em] text-sm">
          Loading Course Universe...
        </p>
      </div>
    );
  }

  if (error || (!currentCourse && !isLoading)) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Something went wrong</h2>
        <p className="text-zinc-500 max-w-md mb-8">
          {error || "We couldn't find the course you were looking for. It might have been moved or deleted."}
        </p>
        <a
          href="/courses"
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Back to Catalog
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#1a0e16] min-h-screen text-white">
      {/* Background blobs for premium feel */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8b3d6f]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <CourseDetailsContent course={currentCourse!} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <CourseSidebar course={currentCourse!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
