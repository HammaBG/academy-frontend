"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { BookOpen, Star, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/app/(shop)/CourseCard";

export default function CoursesListPage() {
  const { courses, isLoading, getPublicCourses } = useCourseStore();

  useEffect(() => {
    getPublicCourses();
  }, [getPublicCourses]);

  return (
    <div className="min-h-screen bg-[#1a0e16] text-white">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#8b3d6f]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black">
            Explore our <span className="text-[#fbad26]">Courses</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
            Join thousands of students and start your journey today with our professionally crafted curriculums.
          </p>
        </div>

        {isLoading && courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Opening the catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {courses.length === 0 && !isLoading && (
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <BookOpen className="w-16 h-16 text-white/5 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">No courses available yet</h3>
            <p className="text-zinc-500 text-sm">Check back later for new educational content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
