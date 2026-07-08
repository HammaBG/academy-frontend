"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { BookOpen, Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function EnrolledCourseCard({ course }: { course: any }) {
    const discount = course.estimated_price
        ? Math.round(((course.estimated_price - course.price) / course.estimated_price) * 100)
        : 0;

    return (
        <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-zinc-100">
            {/* Visual Area */}
            <div className="relative aspect-[4/5] overflow-hidden">
                {/* Course Thumbnail */}
                {course.thumbnail?.url ? (
                    <img
                        src={course.thumbnail.url}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900" />
                )}

                {/* Header Overlay (Instructor) */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-start bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex items-center gap-3 text-right">
                        <div className="text-white">
                            <h4 className="font-bold text-base leading-tight">
                                {course.creator?.first_name} {course.creator?.last_name}
                            </h4>
                            <p className="text-[10px] text-white/80 font-medium truncate max-w-[150px]">
                                {course.creator?.title || "Academy Instructor"}
                            </p>
                        </div>
                        <div className="relative w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden shadow-xl shrink-0">
                            {course.creator?.avatar_url && (
                                <img src={course.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Overlay (Title) */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <div className="space-y-1 text-right">
                        <h3 className="text-2xl md:text-3xl font-black text-[#fbad26] leading-tight drop-shadow-lg">
                            {course.name}
                        </h3>
                        <p className="text-white text-sm md:text-base font-bold drop-shadow-md">
                            {course.short_description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 flex items-center justify-between bg-white border-t border-zinc-100">
                <Link
                  href={`/my-courses/${course.id}`}
                  className="px-5 py-2 bg-[#17bed2] hover:bg-[#14a8ba] text-white text-sm font-black rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  مشاهدة الدورة
                </Link>
            </div>
        </div>
    );
}

export default function MyCoursesPage() {
    const { token } = useAuthStore();
    const { enrolledCourses, isLoading, error, getEnrolledCourses } = useCourseStore();

    useEffect(() => {
        if (token) {
            getEnrolledCourses(token);
        }
    }, [token, getEnrolledCourses]);

    return (
        <div className="min-h-screen bg-[#1a0e16] text-white" dir="rtl">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#8b3d6f]/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl font-black">
                        دوراتي <span className="text-[#fbad26]">المسجلة</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
                        استمر في رحلة التعلم الخاصة بك. الوصول إلى جميع الدورات التي قمت بالتسجيل فيها.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        Error: {error}
                    </div>
                )}

                {isLoading && enrolledCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">جاري تحميل دوراتك...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrolledCourses.map((course) => (
                            <EnrolledCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}

                {!isLoading && enrolledCourses.length === 0 && (
                    <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <BookOpen className="w-16 h-16 text-white/5 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400">لم تقم بالتسجيل في أي دورة بعد</h3>
                        <p className="text-zinc-500 text-sm mb-6">استكشف كتالوج الدورات وابدأ رحلتك التعليمية اليوم.</p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#fbad26] hover:bg-[#e6a325] text-black font-black rounded-lg transition-colors"
                        >
                            تصفح الدورات
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
