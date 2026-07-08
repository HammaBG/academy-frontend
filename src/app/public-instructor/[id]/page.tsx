"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import { Loader2, AlertCircle, BookOpen, PlayCircle, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PublicInstructorPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { courses, getPublicCourses } = useCourseStore();

  const [instructor, setInstructor] = useState<any>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInstructor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://academy-backend-8gl3.onrender.com/api/auth/instructors/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Instructor not found");
        }
        setInstructor(data.instructor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  useEffect(() => {
    if (courses.length === 0) {
      getPublicCourses();
    }
  }, [courses.length, getPublicCourses]);

  useEffect(() => {
    if (!instructor || courses.length === 0) return;

    const filtered = courses.filter((c: any) => {
      const creatorId = typeof c.creator === "string" ? c.creator : c.creator?.id;
      return creatorId === instructor.id;
    });

    setInstructorCourses(filtered);
  }, [instructor, courses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-4" dir="rtl">
        <Navbar />
        <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
        <p className="text-[#fbad26] font-bold animate-pulse uppercase tracking-[0.2em] text-sm">
          جاري تحميل بيانات المعلم...
        </p>
        <Footer />
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <Navbar />
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">المعلم غير موجود</h2>
        <p className="text-zinc-500 max-w-md mb-8">
          {error || "لم نتمكن من تحميل بيانات هذا المعلم."}
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#fbad26] hover:bg-[#e6a325] text-black font-bold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          العودة إلى الصفحة الرئيسية
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0e16] text-white" dir="rtl">
      <Navbar />

      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b3d6f]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-sm mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى الصفحة الرئيسية
        </Link>

        {/* Instructor Header */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-right">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl">
              {instructor.avatar_url ? (
                <img src={instructor.avatar_url} alt={instructor.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <User className="w-16 h-16 text-white/10" />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-black leading-tight">
                {instructor.first_name} {instructor.last_name}
              </h1>
              {instructor.title && (
                <p className="text-[#fbad26] font-bold text-lg">{instructor.title}</p>
              )}
              {instructor.bio && (
                <p className="text-zinc-400 font-medium leading-relaxed max-w-2xl">{instructor.bio}</p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">{instructorCourses.length} دورة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">دورات المعلم</h2>
            <span className="text-sm font-bold text-zinc-500">{instructorCourses.length} دورة</span>
          </div>

          {instructorCourses.length === 0 ? (
            <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <BookOpen className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-400">لا توجد دورات بعد</h3>
              <p className="text-zinc-500 text-sm">لم يقم هذا المعلم بإضافة أي دورات حتى الآن.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructorCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-zinc-100"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {course.thumbnail?.url ? (
                      <img
                        src={course.thumbnail.url}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900" />
                    )}
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
                  <div className="p-4 flex items-center justify-between bg-white border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-sm font-bold">DT</span>
                      <span className="text-3xl font-black text-[#17bed2] tracking-tighter">
                        {course.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
