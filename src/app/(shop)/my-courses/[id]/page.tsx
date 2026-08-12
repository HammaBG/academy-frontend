"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "@/store/course";
import { useAuthStore } from "@/store/auth";
import { Loader2, AlertCircle, PlayCircle, BookOpen, Clock, ArrowRight, ArrowLeft, MessageSquare, Send, CornerDownLeft, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CoursePlayer } from "@/components/CoursePlayer";

export default function MyCourseDetailsPage() {
  const { id } = useParams();
  const { token, user } = useAuthStore();
  const { currentCourse, isLoading, error, getCourseContent, clearCurrentCourse, addQuestion, addAnswer } = useCourseStore();

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [questionText, setQuestionText] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({});
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  useEffect(() => {
    if (id && token) {
      getCourseContent(id as string, token);
    }
    return () => clearCurrentCourse();
  }, [id, token, getCourseContent, clearCurrentCourse]);

  if (isLoading && !currentCourse) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4 text-right" dir="rtl">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
        <p className="text-brand-primary font-extrabold animate-pulse uppercase tracking-widest text-sm">
          جاري تحميل محتوى الدورة...
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
          {error || "لم نتمكن من تحميل محتوى الدورة. ربما لم تقم بالتسجيل في هذه الدورة."}
        </p>
        <Link
          href="/my-courses"
          className="px-8 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          العودة إلى دوراتي
        </Link>
      </div>
    );
  }

  if (!currentCourse) return null;

  const sections = currentCourse.course_data || [];
  const currentSection = sections[activeIdx];

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const handleNext = () => {
    if (activeIdx < sections.length - 1) {
      setActiveIdx(activeIdx + 1);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !questionText.trim()) return;

    const contentId = currentSection?.id || currentSection?._id || currentSection?.title || currentSection?.video_section;
    if (!contentId) return;

    setIsSubmittingQuestion(true);
    try {
      await addQuestion(questionText, currentCourse.id, contentId, token);
      setQuestionText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleReplyToQuestion = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    const replyText = replyTexts[questionId];
    if (!token || !replyText?.trim()) return;

    const contentId = currentSection?.id || currentSection?._id || currentSection?.title || currentSection?.video_section;
    if (!contentId) return;

    setSubmittingReplyId(questionId);
    try {
      await addAnswer(replyText, currentCourse.id, contentId, questionId, token);
      setReplyTexts(prev => ({ ...prev, [questionId]: "" }));
      setShowReplyForm(prev => ({ ...prev, [questionId]: false }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReplyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-x-hidden pt-24 text-right" dir="rtl">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary font-bold text-sm mb-6 transition-colors"
        >
          <span>العودة إلى دوراتي</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>

        {/* Core LMS Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT COLUMN: Player, Controls & Discussions */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            {/* Video Box Container */}
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-border/40 bg-surface shadow-2xl">
              {currentSection?.video_url ? (
                <CoursePlayer videoUrl={currentSection.video_url} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary/30 p-8">
                  <PlayCircle className="w-16 h-16 mb-4" />
                  <p className="text-sm font-bold">لا يوجد فيديو متاح لهذا الدرس</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons under the Video Player */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={activeIdx === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-border/40 hover:border-brand-primary/50 disabled:opacity-40 disabled:pointer-events-none text-text-primary text-sm font-extrabold transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>

              <div className="text-xs sm:text-sm font-extrabold text-text-secondary bg-surface px-4 py-2 rounded-xl border border-border/40">
                {activeIdx + 1} / {sections.length}
              </div>

              <button
                onClick={handleNext}
                disabled={activeIdx === sections.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white hover:bg-brand-primary/95 disabled:opacity-40 disabled:pointer-events-none text-sm font-extrabold transition-all shadow-md shadow-brand-primary/10"
              >
                <span>الدرس التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Lesson Description & Links */}
            {currentSection && (
              <div className="bg-surface border border-border/40 rounded-[32px] p-6 space-y-4 shadow-sm">
                <h2 className="text-xl font-black text-text-primary">وصف الدرس: {currentSection.video_section || currentSection.title}</h2>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">{currentSection.description || "لا يوجد وصف إضافي متوفر للدرس الحالي."}</p>

                {currentSection.links && currentSection.links.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold text-text-primary">روابط ومرفقات الدرس:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSection.links.map((link: any, linkIdx: number) => (
                        <a
                          key={linkIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-background hover:bg-surface border border-border/40 hover:border-brand-primary/50 rounded-xl text-xs font-bold text-text-secondary hover:text-brand-primary transition-all"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Q&A SECTION (DISCUSSIONS) */}
            {currentSection && (
              <div className="bg-surface border border-border/40 rounded-[32px] p-6 md:p-8 space-y-8 shadow-sm">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-brand-primary" />
                    <h2 className="text-xl font-black text-text-primary">منتدى النقاش والأسئلة</h2>
                  </div>
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-black rounded-full">
                    {(currentSection.questions || []).length} أسئلة مطروحة
                  </span>
                </div>

                {/* Ask a Question Form */}
                <form onSubmit={handleAskQuestion} className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="اطرح سؤالاً أو استفساراً حول هذا الدرس..."
                      className="w-full min-h-[100px] bg-background/40 border border-border/60 focus:border-brand-primary p-4 rounded-2xl text-sm font-semibold text-text-primary outline-none transition-colors resize-y pr-4 pl-12"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingQuestion || !questionText.trim()}
                      className="absolute left-4 bottom-4 w-10 h-10 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shadow-md shadow-brand-primary/10"
                      aria-label="إرسال السؤال"
                    >
                      {isSubmittingQuestion ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 rotate-180" />
                      )}
                    </button>
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-6">
                  {(!currentSection.questions || currentSection.questions.length === 0) ? (
                    <div className="text-center py-12 bg-background/20 rounded-[2rem] border border-dashed border-border/60">
                      <MessageSquare className="w-12 h-12 text-text-secondary/20 mx-auto mb-3" />
                      <p className="text-sm font-bold text-text-secondary">لا توجد أسئلة بعد لهذا الدرس</p>
                      <p className="text-xs text-text-secondary/60 mt-1">كن أول من يطرح سؤالاً ويفعل النقاش!</p>
                    </div>
                  ) : (
                    currentSection.questions.map((q: any, qIdx: number) => {
                      const qId = q.id || q._id || qIdx.toString();
                      const replies = q.question_replies || [];
                      const isInstructor = user?.role === "instructor" || user?.role === "admin";
                      
                      return (
                        <div key={qId} className="border border-border/40 p-5 rounded-[2rem] bg-background/30 space-y-4 hover:border-brand-primary/30 transition-all">
                          
                          {/* Question Author info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-border/40 bg-surface flex items-center justify-center overflow-hidden shrink-0">
                                {q.user?.avatar ? (
                                  <img src={q.user.avatar} alt={q.user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <UserIcon className="w-5 h-5 text-text-secondary/40" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-text-primary">{q.user?.name || "طالب"}</h4>
                                <span className="text-[10px] text-text-secondary font-medium block">
                                  {q.created_at ? new Date(q.created_at).toLocaleDateString("ar-EG") : "مؤخراً"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Question Text */}
                          <p className="text-sm font-semibold text-text-primary pr-2 leading-relaxed">
                            {q.question}
                          </p>

                          {/* Replies list */}
                          {replies.length > 0 && (
                            <div className="mr-6 pr-4 border-r border-border/60 space-y-4 pt-2">
                              {replies.map((reply: any, rIdx: number) => (
                                <div key={rIdx} className="flex gap-3 bg-surface/50 p-4 rounded-2xl border border-border/20">
                                  <div className="w-8 h-8 rounded-full border border-border/40 bg-surface flex items-center justify-center overflow-hidden shrink-0">
                                    {reply.user?.avatar ? (
                                      <img src={reply.user.avatar} alt={reply.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <UserIcon className="w-4 h-4 text-text-secondary/40" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-extrabold text-xs text-text-primary">{reply.user?.name || "معلم"}</h5>
                                      {/* Highlight label if replier is the instructor/admin */}
                                      {reply.user?.role === "instructor" || reply.user?.role === "admin" ? (
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-black rounded-full">معلم</span>
                                      ) : null}
                                    </div>
                                    <span className="text-[9px] text-text-secondary font-medium block mt-0.5">
                                      {reply.created_at ? new Date(reply.created_at).toLocaleDateString("ar-EG") : "مؤخراً"}
                                    </span>
                                    <p className="text-xs font-semibold text-text-secondary mt-1.5 leading-relaxed">
                                      {reply.answer}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions / Reply Trigger */}
                          <div className="flex items-center gap-3 pt-1">
                            {!showReplyForm[qId] ? (
                              <button
                                onClick={() => setShowReplyForm(prev => ({ ...prev, [qId]: true }))}
                                className="text-xs font-black text-brand-primary flex items-center gap-1 hover:underline"
                              >
                                <CornerDownLeft className="w-4 h-4" />
                                <span>أضف رداً على السؤال</span>
                              </button>
                            ) : (
                              <form onSubmit={(e) => handleReplyToQuestion(e, qId)} className="w-full flex items-center gap-2">
                                <input
                                  type="text"
                                  value={replyTexts[qId] || ""}
                                  onChange={(e) => setReplyTexts(prev => ({ ...prev, [qId]: e.target.value }))}
                                  placeholder={isInstructor ? "اكتب رد المعلم الرسمي هنا..." : "اكتب ردك ومساعدتك لزميلك هنا..."}
                                  className="flex-1 bg-background/50 border border-border/60 focus:border-brand-primary px-4 py-2.5 rounded-xl text-xs font-semibold text-text-primary outline-none transition-colors"
                                />
                                <button
                                  type="submit"
                                  disabled={submittingReplyId === qId || !(replyTexts[qId] || "").trim()}
                                  className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 disabled:opacity-40"
                                >
                                  {submittingReplyId === qId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5 rotate-180" />
                                  )}
                                  <span>رد</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowReplyForm(prev => ({ ...prev, [qId]: false }))}
                                  className="text-xs font-bold text-text-secondary hover:text-brand-primary px-2"
                                >
                                  إلغاء
                                </button>
                              </form>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Course Syllabus & Description */}
          <div className="lg:col-span-5 space-y-6">
            {/* Course Summary Card */}
            <div className="bg-surface border border-border/40 rounded-[32px] p-6 shadow-sm">
              <h1 className="text-2xl font-black text-text-primary mb-2 leading-tight">{currentCourse.name}</h1>
              <p className="text-text-secondary text-sm leading-relaxed font-medium line-clamp-3 mb-4">{currentCourse.short_description}</p>
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2 text-text-secondary">
                  <BookOpen className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs sm:text-sm font-bold">{sections.length} دروس</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs sm:text-sm font-bold">
                    {sections.reduce((acc: number, section: any) => acc + (section.video_length || 0), 0)} ثانية
                  </span>
                </div>
              </div>
            </div>

            {/* Lessons List container */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-text-primary">قائمة الدروس والمقاطع</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {sections.map((section: any, idx: number) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveIdx(idx);
                        // Reset forms
                        setQuestionText("");
                        setReplyTexts({});
                        setShowReplyForm({});
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center justify-between border transition-all text-right shadow-sm",
                        isActive
                          ? "bg-brand-primary/10 border-brand-primary/45 text-brand-primary"
                          : "bg-surface border-border/40 text-text-primary hover:border-brand-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          isActive
                            ? "bg-brand-primary text-white border-brand-primary/20"
                            : "bg-background border-border/40 text-text-secondary"
                        )}>
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="truncate text-right">
                          <h3 className="font-extrabold text-sm truncate">{section.video_section || `القسم ${idx + 1}`}</h3>
                          <p className="text-[11px] text-text-secondary truncate">{section.title}</p>
                        </div>
                      </div>
                      {section.video_length && (
                        <span className="text-[10px] font-bold text-text-secondary bg-background px-2.5 py-1 rounded-full border border-border/40 shrink-0">
                          {Math.floor(section.video_length / 60)}:{(section.video_length % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
