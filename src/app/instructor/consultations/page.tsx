"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import {
  usePrivateConsultationStore,
  IPrivateConsultation,
} from "@/store/privateConsultation";
import {
  Headphones,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  User as UserIcon,
  MessageSquare,
  Lock,
  ShieldCheck,
  Filter,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InstructorConsultationsPage() {
  const { token, user } = useAuthStore();
  const {
    instructorConsultations,
    instructorStats,
    currentConsultation,
    isLoading,
    fetchInstructorConsultations,
    fetchSingleConsultation,
    replyToConsultation,
    updateStatus,
  } = usePrivateConsultationStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const { socket } = useChatStore();
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Live real-time update when student sends private message
  useEffect(() => {
    if (!socket) return;
    const handleLiveUpdate = (data: { type?: string }) => {
      if (data?.type === "private_consultation" && token) {
        fetchInstructorConsultations(token, { status: statusFilter });
        if (selectedId) {
          fetchSingleConsultation(selectedId, token);
        }
      }
    };

    socket.on("new_chat_notification", handleLiveUpdate);
    return () => {
      socket.off("new_chat_notification", handleLiveUpdate);
    };
  }, [socket, token, statusFilter, selectedId, fetchInstructorConsultations, fetchSingleConsultation]);

  useEffect(() => {
    if (token) {
      fetchInstructorConsultations(token, {
        status: statusFilter,
      });
    }
  }, [token, statusFilter, fetchInstructorConsultations]);

  // Auto select first consultation if none selected
  useEffect(() => {
    if (!selectedId && instructorConsultations.length > 0) {
      setSelectedId(instructorConsultations[0]._id);
      if (token) fetchSingleConsultation(instructorConsultations[0]._id, token);
    }
  }, [instructorConsultations, selectedId, token, fetchSingleConsultation]);

  useEffect(() => {
    if (selectedId && token) {
      fetchSingleConsultation(selectedId, token);
    }
  }, [selectedId, token, fetchSingleConsultation]);

  // Scroll to bottom on new message in active thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConsultation?.messages]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedId || !replyText.trim()) return;

    setIsReplying(true);
    try {
      await replyToConsultation(selectedId, replyText.trim(), token);
      setReplyText("");
      toast.success("تم إرسال ردك إلى الطالب بنجاح");
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الرد");
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "open" | "answered" | "closed") => {
    if (!token) return;
    try {
      await updateStatus(id, newStatus, token);
      toast.success("تم تحديث حالة الاستشارة");
    } catch (err: any) {
      toast.error(err.message || "فشل تحديث الحالة");
    }
  };

  const filteredConsultations = instructorConsultations.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.subject.toLowerCase().includes(term) ||
      c.studentName.toLowerCase().includes(term) ||
      c.courseName.toLowerCase().includes(term) ||
      (c.lessonTitle && c.lessonTitle.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-right max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              الاستشارات والرسائل السرية
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-black bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>خصوصية 100%</span>
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            إدارة والرد على الأسئلة الحساسة والاستشارات الفردية الموجهة إليك من طلاب دوراتك في سرية تامة.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/40 text-center">
            <span className="text-[10px] text-text-secondary block font-bold">بانتظار الرد</span>
            <span className="text-sm font-black text-amber-500">{instructorStats?.open || 0}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/40 text-center">
            <span className="text-[10px] text-text-secondary block font-bold">تم الرد</span>
            <span className="text-sm font-black text-emerald-500">{instructorStats?.answered || 0}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/40 text-center">
            <span className="text-[10px] text-text-secondary block font-bold">الإجمالي</span>
            <span className="text-sm font-black text-text-primary">{instructorStats?.total || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* RIGHT COLUMN: Consultation List & Filters */}
        <div className="lg:col-span-5 bg-surface border border-border/40 rounded-3xl p-4 sm:p-5 flex flex-col space-y-4 shadow-sm">
          {/* Search + Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث بالطالب، الدورة، أو الموضوع..."
                className="w-full pr-10 pl-3 py-2 bg-background/50 border border-border/60 focus:border-brand-primary rounded-xl text-xs font-bold text-text-primary outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "الكل" },
                { id: "open", label: "بانتظار ردك" },
                { id: "answered", label: "تم الرد" },
                { id: "closed", label: "مغلقة" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors",
                    statusFilter === tab.id
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-background/60 text-text-secondary hover:text-text-primary border border-border/40"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[520px]">
            {isLoading && instructorConsultations.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-brand-primary">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center py-12 text-text-secondary space-y-2">
                <Headphones className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs font-bold">لا توجد استشارات مطابقة حالياً</p>
              </div>
            ) : (
              filteredConsultations.map((item) => {
                const isSelected = item._id === selectedId;
                const hasUnread = (item.unreadByInstructor || 0) > 0;

                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item._id)}
                    className={cn(
                      "p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 text-right relative",
                      isSelected
                        ? "bg-brand-primary/10 border-brand-primary/50 shadow-xs"
                        : "bg-background/40 border-border/40 hover:border-brand-primary/30"
                    )}
                  >
                    {hasUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute top-3 left-3 animate-pulse" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-xs font-black shrink-0">
                          {item.studentName ? item.studentName[0] : "ط"}
                        </div>
                        <span className="text-xs font-black text-text-primary truncate">
                          {item.studentName}
                        </span>
                      </div>

                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black",
                          item.status === "answered"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : item.status === "closed"
                            ? "bg-gray-500/15 text-gray-500"
                            : "bg-amber-500/15 text-amber-600"
                        )}
                      >
                        {item.status === "answered" ? "تم الرد" : item.status === "closed" ? "مغلقة" : "جديدة"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-text-primary line-clamp-1">{item.subject}</h4>

                    <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1 border-t border-border/20">
                      <span className="truncate max-w-[65%]">{item.courseName}</span>
                      <span>
                        {new Date(item.lastMessageAt).toLocaleDateString("ar-EG", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* LEFT COLUMN: Active Thread Viewer */}
        <div className="lg:col-span-7 bg-surface border border-border/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-sm space-y-4">
          {currentConsultation ? (
            <>
              {/* Thread Header */}
              <div className="border-b border-border/40 pb-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-text-primary">{currentConsultation.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1">
                      <span>الطالب: <strong className="text-text-primary">{currentConsultation.studentName}</strong></span>
                      <span>· الدورة: <strong className="text-brand-primary">{currentConsultation.courseName}</strong></span>
                      {currentConsultation.lessonTitle && (
                        <span>· الدرس: <strong>{currentConsultation.lessonTitle}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select
                      value={currentConsultation.status}
                      onChange={(e) => handleStatusChange(currentConsultation._id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-background border border-border/50 text-xs font-bold text-text-primary outline-none cursor-pointer"
                    >
                      <option value="open">قيد الانتظار</option>
                      <option value="answered">تم الرد</option>
                      <option value="closed">إغلاق الاستشارة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages History */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-1">
                {currentConsultation.messages.map((msg, idx) => {
                  const isInstructor = msg.senderRole === "instructor" || msg.senderRole === "admin";

                  return (
                    <div
                      key={msg._id || idx}
                      className={cn("flex gap-3 max-w-[85%]", isInstructor ? "mr-auto flex-row-reverse" : "ml-auto")}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border",
                          isInstructor
                            ? "bg-brand-primary text-white border-brand-primary/40"
                            : "bg-background border-border text-text-secondary"
                        )}
                      >
                        {isInstructor ? "أنا" : "ط"}
                      </div>

                      <div
                        className={cn(
                          "p-4 rounded-2xl space-y-1 text-xs leading-relaxed border shadow-xs",
                          isInstructor
                            ? "bg-brand-primary text-white rounded-br-xs border-brand-primary/40"
                            : "bg-background text-text-primary rounded-bl-xs border-border/50"
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
                <div ref={threadEndRef} />
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-border/40 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك وتوجيهك الأسري/النفسي للطالب هنا..."
                  className="flex-1 p-3.5 bg-background/50 border border-border/60 focus:border-brand-primary rounded-2xl text-xs font-medium text-text-primary outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="px-5 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white flex items-center justify-center gap-1.5 text-xs font-black shadow-md shadow-brand-primary/20 transition-all disabled:opacity-40 shrink-0"
                >
                  {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
                  <span>إرسال الرد</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-3 py-24">
              <MessageSquare className="w-12 h-12 opacity-30" />
              <p className="text-sm font-bold">اختر استشارة من القائمة لعرض المحادثة والرد عليها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
