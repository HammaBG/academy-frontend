"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { BookOpen, PlayCircle, Star, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";

function EnrolledCourseCard({ course }: { course: any }) {
    const categoryColor = course.category_color || "#F95353";
    const ratingValue = course.ratings ? course.ratings.toFixed(1) : "4.8";
    const categoryName = course.categories || "دورة مسجلة";

    return (
        <Link
            href={`/my-courses/${course.id}`}
            className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md text-right select-none"
        >
            {/* Top Image Container */}
            <div className="relative h-56 w-full overflow-hidden bg-background">
                {course.thumbnail?.url ? (
                    <img
                        src={course.thumbnail.url}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-surface flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-text-secondary/40" />
                    </div>
                )}

                {/* Top Right: Category Tag */}
                <div
                    className="absolute top-4 right-4 h-7 px-3.5 py-1 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center shadow-md backdrop-blur-md"
                    style={{ backgroundColor: categoryColor }}
                >
                    {categoryName}
                </div>

                {/* Bottom Image Overlay: Instructor Avatar & Name */}
                <div className="absolute bottom-4 right-4 left-4 flex items-center gap-2.5 z-10">
                    <div className="w-9 h-9 rounded-full border-2 border-white/60 overflow-hidden bg-surface shrink-0 shadow-md">
                        {course.creator?.avatar_url ? (
                            <img
                                src={course.creator.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-primary/20 text-white">
                                <UserIcon className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col text-right truncate">
                        <span className="text-xs font-extrabold text-white leading-tight drop-shadow-md truncate">
                            {course.creator?.first_name ? `${course.creator.first_name} ${course.creator.last_name || ""}` : "مدرب الأكاديمية"}
                        </span>
                        <span className="text-[10px] font-semibold text-white/80 truncate">
                            {course.creator?.title || "خبير متخصص"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2.5">
                    {/* Rating & Level row */}
                    <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{ratingValue}</span>
                        </div>

                        {course.level && (
                            <span className="text-text-secondary bg-surface border border-border/40 px-2.5 py-1 rounded-full text-[11px]">
                                {course.level}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                        {course.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed font-medium">
                        {course.short_description || "تعلم أفضل المهارات التطبيقية والعملية في هذه الدورة المتميزة."}
                    </p>
                </div>

                {/* Footer: Learn Action Button */}
                <div className="border-t border-border/40 pt-4 flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <BookOpen className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-bold">{course.course_data?.length || 0} دروس</span>
                    </div>

                    <span className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center gap-1.5 active:scale-95">
                        <PlayCircle className="w-4 h-4" />
                        <span>شاهد الدورة</span>
                    </span>
                </div>
            </div>
        </Link>
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
        <div className="min-h-screen bg-background text-text-primary relative overflow-x-hidden pt-24 text-right" dir="rtl">
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary">
                        دوراتي <span className="text-brand-primary">المسجلة</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto font-medium text-sm sm:text-base">
                        استمر في رحلة التعلم الخاصة بك. الوصول سريع ومباشر إلى جميع دوراتك المسجلة.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2 mb-8 justify-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>خطأ في تحميل دوراتك: {error}</span>
                    </div>
                )}

                {isLoading && enrolledCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader size="md" />
                        <p className="text-text-secondary font-bold text-sm">جاري تحميل دوراتك...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrolledCourses.map((course) => (
                            <EnrolledCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}

                {!isLoading && enrolledCourses.length === 0 && (
                    <div className="py-24 text-center bg-surface rounded-[32px] border border-dashed border-border/60 max-w-2xl mx-auto">
                        <BookOpen className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-text-primary mb-1">لم تقم بالتسجيل في أي دورة بعد</h3>
                        <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto font-medium">استكشف كتالوج المسارات والدورات وابدأ رحلتك التعليمية اليوم.</p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-brand-primary/10 hover:scale-105"
                        >
                            تصفح الكورسات
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
