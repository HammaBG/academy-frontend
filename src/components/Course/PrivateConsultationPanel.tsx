"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import {
  usePrivateConsultationStore,
  IPrivateConsultation,
} from "@/store/privateConsultation";
import {
  ShieldCheck,
  Lock,
  Send,
  Loader2,
  Clock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PrivateConsultationPanelProps {
  courseId: string;
  courseName: string;
  currentLessonTitle?: string;
  currentSectionId?: string;
}

export function PrivateConsultationPanel({
  courseId,
  courseName,
  currentLessonTitle,
  currentSectionId,
}: PrivateConsultationPanelProps) {
  const { user, token } = useAuthStore();
  const { socket } = useChatStore();
  const {
    myConsultations,
    currentConsultation,
    isLoading,
    fetchMyCourseConsultations,
    createConsultation,
    fetchSingleConsultation,
    replyToConsultation,
    clearCurrentConsultation,
  } = usePrivateConsultationStore();

  const [view, setView] = useState<"list" | "new" | "thread">("list");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live real-time update when instructor replies
  useEffect(() => {
    if (!socket) return;
    const handleLiveReply = (data: { type?: string }) => {
      if (data?.type === "private_consultation" && token && courseId) {
        fetchMyCourseConsultations(courseId, token);
        if (currentConsultation?._id) {
          fetchSingleConsultation(currentConsultation._id, token);
        }
      }
    };

    socket.on("new_chat_notification", handleLiveReply);
    return () => {
      socket.off("new_chat_notification", handleLiveReply);
    };
  }, [socket, token, courseId, currentConsultation?._id, fetchMyCourseConsultations, fetchSingleConsultation]);

  // Fetch consultations on mount & when courseId changes
  useEffect(() => {
    if (token && courseId) {
      fetchMyCourseConsultations(courseId, token);
    }
    return () => clearCurrentConsultation();
  }, [token, courseId, fetchMyCourseConsultations, clearCurrentConsultation]);

  // Pre-fill subject if lesson title provided
  useEffect(() => {
    if (currentLessonTitle && view === "new" && !subject) {
      setSubject(`استفسار سري حول: ${currentLessonTitle}`);
    }
  }, [currentLessonTitle, view, subject]);

  // Auto scroll to bottom of thread
  useEffect(() => {
    if (view === "thread" && currentConsultation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [view, currentConsultation?.messages]);

  const handleOpenThread = async (consultation: IPrivateConsultation) => {
    if (!token) return;
    await fetchSingleConsultation(consultation._id, token);
    setView("thread");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }
    if (!subject.trim()) {
      toast.error("يرجى كتابة عنوان للاستشارة");
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      toast.error("يرجى كتابة تفاصيل استفسارك أو مشكلتك (5 أحرف على الأقل)");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createConsultation(
        {
          courseId,
          lessonTitle: currentLessonTitle || "",
          sectionId: currentSectionId || "",
          subject: subject.trim(),
          message: message.trim(),
        },
        token
      );
      toast.success("تم إرسال استشارتك السرية بنجاح إلى المستشار");
      setSubject("");
      setMessage("");
      await fetchSingleConsultation(created._id, token);
      setView("thread");
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الاستشارة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !currentConsultation || !replyText.trim()) return;

    setIsReplying(true);
    try {
      await replyToConsultation(currentConsultation._id, replyText.trim(), token);
      setReplyText("");
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الرد");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-surface border border-border/40 rounded-[32px] p-5 sm:p-7 shadow-sm space-y-6 text-right" dir="rtl">
      {/* Privacy Guarantee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-l from-brand-primary/10 via-brand-primary/5 to-transparent border border-brand-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text-primary">ركن الاستشارة السرية مع المستشار</h3>
              <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>خصوصية تامة 100%</span>
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              محادثة ثنائية محمية لا يراها أي طالب آخر. يمكنك طرح مشكلاتك الأسرية أو الشخصية بأمان وثقة.
            </p>
          </div>
        </div>

        {view === "list" && (
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-black shadow-md shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>استشارة خاصة جديدة</span>
          </button>
        )}

        {view !== "list" && (
          <button
            type="button"
            onClick={() => setView("list")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-background border border-border/40 text-text-secondary hover:text-text-primary text-xs font-bold transition-all shrink-0"
          >
            <span>استشاراتي السابقة</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* VIEW 1: NEW CONSULTATION FORM */}
      {view === "new" && (
        <form onSubmit={handleCreate} className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary">عنوان أو موضوع الاستشارة:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: صعوبة في التفاهم مع شريكي حول مصروف البيت..."
              className="w-full p-3.5 bg-background/50 border border-border/60 focus:border-brand-primary rounded-2xl text-xs font-bold text-text-primary outline-none transition-all"
            />
          </div>

          {currentLessonTitle && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/70 border border-border/30 text-[11px] text-text-secondary">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>مرتبط بالدرس الحالي:</span>
              <strong className="text-text-primary truncate">{currentLessonTitle}</strong>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary">تفاصيل ما تمر به وتود استشارة المدرب فيه:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="اكتب كل ما في خاطرك بوضوح ودون تردد، هذه المحادثة مشفرة وسرية وموجهة مباشرة للمستشار..."
              className="w-full p-4 bg-background/50 border border-border/60 focus:border-brand-primary rounded-2xl text-xs font-medium text-text-primary leading-relaxed outline-none transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-black shadow-md shadow-brand-primary/20 transition-all disabled:opacity-40"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
              <span>إرسال الاستشارة في سرية تامة</span>
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: THREAD CONVERSATION */}
      {view === "thread" && currentConsultation && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-sm text-text-primary">{currentConsultation.subject}</h4>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary mt-1">
                <span>المستشار: <strong className="text-brand-primary">{currentConsultation.instructorName || "المستشار الأسري"}</strong></span>
                {currentConsultation.lessonTitle && (
                  <span>· الدرس: <strong>{currentConsultation.lessonTitle}</strong></span>
                )}
              </div>
            </div>

            <span
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black self-start sm:self-auto",
                currentConsultation.status === "answered"
                  ? "bg-emerald-500/15 text-emerald-600"
                  : currentConsultation.status === "closed"
                  ? "bg-gray-500/15 text-gray-500"
                  : "bg-amber-500/15 text-amber-600"
              )}
            >
              {currentConsultation.status === "answered"
                ? "تم الرد من المستشار ✓"
                : currentConsultation.status === "closed"
                ? "مغلقة"
                : "قيد المراجعة لدى المستشار"}
            </span>
          </div>

          {/* Messages list container */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto p-3 rounded-2xl bg-background/30 border border-border/30">
            {currentConsultation.messages.map((msg, idx) => {
              const isMe = msg.senderId === user?.id;
              const isInstructor = msg.senderRole === "instructor" || msg.senderRole === "admin";

              return (
                <div
                  key={msg._id || idx}
                  className={cn("flex gap-3 max-w-[85%]", isMe ? "mr-auto flex-row-reverse" : "ml-auto")}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border",
                      isInstructor
                        ? "bg-brand-primary text-white border-brand-primary/40"
                        : "bg-surface border-border text-text-secondary"
                    )}
                  >
                    {isInstructor ? "م" : "أنا"}
                  </div>

                  <div
                    className={cn(
                      "p-4 rounded-2xl space-y-1 text-xs leading-relaxed border shadow-xs",
                      isMe
                        ? "bg-brand-primary text-white rounded-br-xs border-brand-primary/40"
                        : "bg-surface text-text-primary rounded-bl-xs border-border/50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1">
                      <span className="font-black">{msg.senderName}</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply form */}
          {currentConsultation.status !== "closed" ? (
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك أو تعقيبك للمستشار هنا..."
                className="flex-1 p-3.5 bg-background/50 border border-border/60 focus:border-brand-primary rounded-2xl text-xs font-medium text-text-primary outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isReplying || !replyText.trim()}
                className="w-12 h-12 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white flex items-center justify-center shadow-md shadow-brand-primary/20 transition-all disabled:opacity-40 shrink-0"
                aria-label="إرسال الرد"
              >
                {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
              </button>
            </form>
          ) : (
            <p className="text-center text-xs text-text-secondary py-2 bg-background/50 rounded-xl">
              تم إغلاق هذه الاستشارة. يمكنك بدء استشارة جديدة في أي وقت.
            </p>
          )}
        </div>
      )}

      {/* VIEW 3: LIST OF MY CONSULTATIONS */}
      {view === "list" && (
        <div className="space-y-3">
          {isLoading && myConsultations.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-brand-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : myConsultations.length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-background/40 border border-dashed border-border/60 rounded-2xl p-6">
              <Headphones className="w-10 h-10 mx-auto text-text-secondary/40" />
              <p className="text-xs font-bold text-text-secondary">
                لم تقم بإرسال أي استشارة خاصة في هذه الدورة بعد.
              </p>
              <button
                type="button"
                onClick={() => setView("new")}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black hover:scale-105 transition-transform"
              >
                <PlusCircle className="w-4 h-4" />
                <span>طرح أول استفسار سري للمستشار</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myConsultations.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleOpenThread(c)}
                  className="p-4 rounded-2xl bg-background/50 border border-border/40 hover:border-brand-primary/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-border/40 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <h4 className="font-black text-xs sm:text-sm text-text-primary truncate">{c.subject}</h4>
                      <p className="text-[10px] text-text-secondary truncate mt-0.5 font-medium">
                        {c.lessonTitle ? `الدرس: ${c.lessonTitle}` : c.courseName} · {c.messages?.length || 0} رسائل
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black",
                        c.status === "answered"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : c.status === "closed"
                          ? "bg-gray-500/15 text-gray-500"
                          : "bg-amber-500/15 text-amber-600"
                      )}
                    >
                      {c.status === "answered" ? "تم الرد ✓" : c.status === "closed" ? "مغلقة" : "قيد المراجعة"}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-text-secondary/50 group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
