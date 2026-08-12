"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Course } from "@/store/course";
import { CourseCard } from "../Course/CourseCard";

interface LatestCoursesSectionProps {
  courses: Course[];
  isLoading: boolean;
}

export function LatestCoursesSection({ courses, isLoading }: LatestCoursesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border/40 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            استكشف <span className="text-brand-primary">الدورات</span> المميزة
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl font-medium mt-2">
            برامج ودورات رقمية مبنية على أسس علمية في علم النفس والعلاقات والتربية الواعية، لمساعدتك على بناء حياة أسرية أكثر وعياً واستقراراً.
          </p>
        </div>
        <Link
          href="/courses"
          className="group flex items-center gap-2 text-brand-primary font-bold hover:text-brand-primary/80 transition-colors"
        >
          <span>عرض جميع الكورسات</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(courses || []).slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
