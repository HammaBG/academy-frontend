"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { useNoteStore } from "@/store/note";
import {
    BookOpen,
    PlayCircle,
    Star,
    User as UserIcon,
    StickyNote,
    Clock,
    Trash2,
    Sparkles,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

function EnrolledCourseCard({ course }: { course: any }) {
    const courseSlugOrId = course.url || course.id || course._id;
    const categoryColor = course.category_color || "#F95353";
    const ratingValue = course.ratings ? course.ratings.toFixed(1) : "4.8";
    const categoryName = course.categories || "دورة مسجلة";

    return (
        <Link
            href={`/my-courses/${courseSlugOrId}`}
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

                    {(course.progress === 100 || (course.completedVideos && course.course_data && course.completedVideos.length >= course.course_data.length && course.course_data.length > 0)) ? (
                        <span className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                            <span>شهادة الإكمال</span>
                        </span>
                    ) : (
                        <span className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center gap-1.5 active:scale-95">
                            <PlayCircle className="w-4 h-4" />
                            <span>شاهد الدورة</span>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function MyCoursesPage() {
    const { token, user } = useAuthStore();
    const { enrolledCourses, courses, isLoading, error, getEnrolledCourses, getAllCourses, getInstructorCourses } = useCourseStore();
    const { notes, fetchUserNotes, deleteNote, getUserNotes } = useNoteStore();

    const userRole = user?.role || (user as any)?.user_metadata?.role;
    const isAdmin = userRole === "admin";
    const isInstructor = userRole === "instructor";

    useEffect(() => {
        if (token) {
            if (isAdmin) {
                getAllCourses(token);
            } else if (isInstructor) {
                getInstructorCourses(token);
            } else {
                getEnrolledCourses(token);
            }
            fetchUserNotes(token);
        }
    }, [token, isAdmin, isInstructor, getEnrolledCourses, getAllCourses, getInstructorCourses, fetchUserNotes]);

    const displayCourses = displayCoursesList(isAdmin, isInstructor, enrolledCourses, courses);
    const userNotes = getUserNotes(user?.id || "guest");

    function displayCoursesList(adminMode: boolean, instructorMode: boolean, enrolled: any[], all: any[]) {
        return (adminMode || instructorMode) ? all : enrolled;
    }

    const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteNote(noteId, token);
        toast.success("تم حذف الملاحظة بنجاح");
    };

    return (
        <div className="min-h-screen bg-background text-text-primary relative overflow-x-hidden pt-24 text-right" dir="rtl">
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary">
                        {isAdmin ? (
                            <>لوحة التحكم: <span className="text-brand-primary">جميع الكورسات</span></>
                        ) : isInstructor ? (
                            <>لوحة التحكم: <span className="text-brand-primary">كورساتي التعليمية</span></>
                        ) : (
                            <>دوراتي <span className="text-brand-primary">المسجلة</span></>
                        )}
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto font-medium text-sm sm:text-base">
                        {isAdmin
                            ? "بصفتك مديراً للنظام، يمكنك تصفح ومشاهدة محتويات جميع الكورسات المتاحة في المنصة."
                            : isInstructor
                                ? "هنا تجد جميع الكورسات التي قمت بإنشائها أو الإشراف على تقديمها للطلاب."
                                : "استمر في رحلة التعلم الخاصة بك. الوصول سريع ومباشر إلى جميع دوراتك ومقاطعك المحفوظة."
                        }
                    </p>
                    {isInstructor && (
                        <div className="pt-2 flex justify-center">
                            <Link
                                href="/instructor/dashboard"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                                <span>الذهاب إلى لوحة تحكم المدرب والتحليلات</span>
                                <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2 justify-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>خطأ في تحميل الكورسات: {error}</span>
                    </div>
                )}

                {/* Enrolled Courses Grid */}
                <section aria-label="قائمة الدورات">
                    {isLoading && displayCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader size="md" />
                            <p className="text-text-secondary font-bold text-sm">جاري تحميل الكورسات...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayCourses.map((course, idx) => {
                                const courseKey = course.id || course._id || idx;
                                return <EnrolledCourseCard key={courseKey} course={course} />;
                            })}
                        </div>
                    )}

                    {!isLoading && displayCourses.length === 0 && (
                        <div className="py-24 text-center bg-surface rounded-[32px] border border-dashed border-border/60 max-w-2xl mx-auto">
                            <BookOpen className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-text-primary mb-1">
                                {isAdmin ? "لا توجد كورسات مضافة بعد" : isInstructor ? "لم تقم بإضافة أي كورس بعد" : "لم تقم بالتسجيل في أي دورة بعد"}
                            </h3>
                            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto font-medium">
                                {isAdmin || isInstructor
                                    ? "قم بإنشاء كورس جديد من لوحة تحكم الإدارة لبدء نشره."
                                    : "استكشف كتالوج المسارات والدورات وابدأ رحلتك التعليمية اليوم."
                                }
                            </p>
                            <Link
                                href={isAdmin || isInstructor ? "/instructor/courses" : "/courses"}
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-brand-primary/10 hover:scale-105"
                            >
                                {isAdmin || isInstructor ? "إدارة الكورسات" : "تصفح الكورسات"}
                            </Link>
                        </div>
                    )}
                </section>

                {/* MY SAVED CLIPS & SMART NOTES SECTION */}
                <section aria-label="مقاطعي وملاحظاتي الذكية" className="pt-10 border-t border-border/50 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-xs">
                                <StickyNote className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-text-primary flex items-center gap-2">
                                    <span>مقاطعي المحفوظة وملاحظاتي الذكية</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-text-secondary font-medium">
                                    جميع اللحظات والملاحظات التي قمت بتدوينها أثناء مشاهدة الدروس للرجوع إليها فوراً
                                </p>
                            </div>
                        </div>

                        <span className="px-4 py-1.5 bg-surface border border-border/40 text-text-primary text-xs font-black rounded-full w-fit">
                            {userNotes.length} مقطع مدوّن
                        </span>
                    </div>

                    {userNotes.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center bg-surface/50 backdrop-blur-md rounded-[32px] border border-dashed border-border/60 max-w-2xl mx-auto space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-black text-text-primary">لم تقم بتدوين أي ملاحظات زمنية بعد</h3>
                            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
                                أثناء مشاهدتك لأي درس، يمكنك تدوين ملاحظة عند دقيقة معينة وستظهر هنا لتتمكن من القفز مباشرة إلى الفيديو في أي وقت!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userNotes.map((note) => {
                                const targetUrl = `/my-courses/${note.courseId}?section=${encodeURIComponent(note.sectionId)}&t=${note.timestampSeconds}`;

                                return (
                                    <div
                                        key={note.id}
                                        className="group bg-surface/90 backdrop-blur-md rounded-3xl border border-border/50 hover:border-brand-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
                                    >
                                        <div className="p-6 space-y-4">
                                            {/* Top info: Course & Lesson title */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1 min-w-0">
                                                    <span className="text-[11px] font-black text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md truncate inline-block max-w-full">
                                                        {note.courseName}
                                                    </span>
                                                    <h4 className="text-base font-black text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                                                        {note.sectionTitle}
                                                    </h4>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDeleteNote(note.id, e)}
                                                    className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                                                    title="حذف الملاحظة"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Note text quote */}
                                            <div className="p-3.5 rounded-2xl bg-background/70 border border-border/40">
                                                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium line-clamp-3">
                                                    "{note.text}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Footer: Timestamp & Action Link */}
                                        <div className="p-4 px-6 border-t border-border/40 bg-surface/50 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1.5 text-xs font-black text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-xl border border-brand-primary/20">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>[{note.timeFormatted}]</span>
                                            </div>

                                            <Link
                                                href={targetUrl}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-brand-primary/20 hover:scale-105 active:scale-95"
                                            >
                                                <PlayCircle className="w-4 h-4" />
                                                <span>شاهد المقطع</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

