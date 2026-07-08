"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { Loader2, AlertCircle, PlayCircle, ChevronDown, BookOpen, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CoursePlayer } from "@/components/CoursePlayer";

export default function MyCourseDetailsPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentCourse, isLoading, error, getCourseContent, clearCurrentCourse } = useCourseStore();

  const [openSection, setOpenSection] = useState<number | null>(null);
  const [playingSection, setPlayingSection] = useState<number | null>(null);

  useEffect(() => {
    if (id && token) {
      getCourseContent(id as string, token);
    }
    return () => clearCurrentCourse();
  }, [id, token, getCourseContent, clearCurrentCourse]);

  if (isLoading && !currentCourse) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-4" dir="rtl">
        <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
        <p className="text-[#fbad26] font-bold animate-pulse uppercase tracking-[0.2em] text-sm">
          جاري تحميل محتوى الدورة...
        </p>
      </div>
    );
  }

  if (error || (!currentCourse && !isLoading)) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">حدث خطأ ما</h2>
        <p className="text-zinc-500 max-w-md mb-8">
          {error || "لم نتمكن من تحميل محتوى الدورة. ربما لم تقم بالتسجيل في هذه الدورة."}
        </p>
        <Link
          href="/my-courses"
          className="px-8 py-3 bg-[#fbad26] hover:bg-[#e6a325] text-black font-bold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          العودة إلى دوراتي
        </Link>
      </div>
    );
  }

  if (!currentCourse) return null;

  return (
    <div className="min-h-screen bg-[#1a0e16] text-white" dir="rtl">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b3d6f]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Back button */}
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-sm mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى دوراتي
        </Link>

        {/* Course Header */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              {currentCourse.thumbnail?.url ? (
                <img src={currentCourse.thumbnail.url} alt={currentCourse.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/10" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl md:text-4xl font-black leading-tight">{currentCourse.name}</h1>
              <p className="text-zinc-400 font-medium leading-relaxed">{currentCourse.short_description}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">{currentCourse.course_data?.length || 0} أقسام</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {currentCourse.course_data?.reduce((acc: number, section: any) => acc + (section.video_length || 0), 0) || 0} دقيقة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">محتوى الدورة</h2>
            <span className="text-sm font-bold text-zinc-500">{currentCourse.course_data?.length || 0} أقسام</span>
          </div>

          <div className="space-y-4">
            {currentCourse.course_data?.map((section: any, idx: number) => (
              <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] hover:border-white/10 transition-colors">
                <button
                  onClick={() => {
                    if (openSection === idx) {
                      setOpenSection(null);
                      setPlayingSection(null);
                    } else {
                      setOpenSection(idx);
                      setPlayingSection(section.video_url ? idx : null);
                    }
                  }}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-black text-white text-lg">{section.video_section || `القسم ${idx + 1}`}</h3>
                      <p className="text-xs text-zinc-500 font-bold">{section.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {section.video_length && (
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                        {Math.floor(section.video_length / 60)}:{(section.video_length % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                    <ChevronDown className={cn("w-5 h-5 text-zinc-500 transition-transform", openSection === idx && "rotate-180")} />
                  </div>
                </button>
                {openSection === idx && (
                  <div className="p-6 pt-0 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4">
                      <p className="text-zinc-400 text-sm leading-relaxed text-right">{section.description}</p>

                      {section.video_url && (
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 relative">
                          {playingSection === idx ? (
                            <CoursePlayer videoUrl={section.video_url} />
                          ) : (
                            <div
                              className="w-full h-full cursor-pointer relative flex items-center justify-center"
                              onClick={() => setPlayingSection(idx)}
                            >
                              {section.video_thumbnail ? (
                                <img src={section.video_thumbnail} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                  <BookOpen className="w-12 h-12 text-white/10" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-20 h-20 bg-[#fbad26] rounded-full flex items-center justify-center shadow-2xl">
                                  <PlayCircle className="w-10 h-10 text-[#211] ml-1" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {section.links && section.links.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-zinc-300">روابط مفيدة</h4>
                          <div className="flex flex-wrap gap-2">
                            {section.links.map((link: any, linkIdx: number) => (
                              <a
                                key={linkIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white transition-colors"
                              >
                                {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.suggestion && (
                        <div className="p-4 bg-[#fbad26]/10 border border-[#fbad26]/20 rounded-xl">
                          <p className="text-sm text-[#fbad26] font-medium text-right">{section.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
