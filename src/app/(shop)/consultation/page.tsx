"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useTicketStore, ITicket } from "@/store/ticket";
import { 
  Headphones, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  User, 
  Phone,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
  PlusCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { 
    id: "pre_marriage", 
    label: "التأهيل والاستعداد للزواج", 
    desc: "معايير الاختيار السليم لشريك الحياة، فترة الخطوبة، وفهم النفس واحتياجاتها قبل الارتباط" 
  },
  { 
    id: "marital_relations", 
    label: "العلاقة الزوجية والتواصل الفعّال", 
    desc: "فهم الاختلافات النفسية بين الزوجين، احتواء الخلافات، وبناء المودة والتفاهم المشترك" 
  },
  { 
    id: "conscious_parenting", 
    label: "التربية الواعية وتنشئة الأبناء", 
    desc: "التعامل مع سلوكيات الأطفال والمراهقين، بناء الذكاء العاطفي، والتربية القائمة على الحوار" 
  },
  { 
    id: "psychological_wellbeing", 
    label: "الصحة النفسية والتعافي الأسري", 
    desc: "إدارة الضغوط والمشاعر، التعافي من الصدمات وتجارب الماضي، وتعزيز التوازن الذاتي" 
  },
  { 
    id: "family_guidance", 
    label: "إرشاد وتوجيه أسري عام", 
    desc: "حيرة في تحديد المسار المناسب أو البرنامج التدريبي والمقال الملائم لحالتك الأسرية الحالية" 
  },
];

export default function ConsultationPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const { myTickets, isLoading, createTicket, fetchMyTickets, addReply } = useTicketStore();

  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [currentLevel, setCurrentLevel] = useState<string>("single_or_engaged");
  const [goalOrIssue, setGoalOrIssue] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [userPhone, setUserPhone] = useState(user?.phone || "");

  useEffect(() => {
    if (token) {
      fetchMyTickets(token);
    }
  }, [token, fetchMyTickets]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      toast.error("يرجى تسجيل الدخول أولاً لطلب استشارة");
      router.push("/login");
      return;
    }

    if (!subject.trim()) {
      toast.error("يرجى إدخال عنوان للاستشارة");
      return;
    }

    if (goalOrIssue.trim().length < 10) {
      toast.error("يرجى شرح مشكلتك أو هدفك بالتفصيل (10 أحرف على الأقل)");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTicket(
        {
          subject: subject.trim(),
          category,
          currentLevel,
          goalOrIssue: goalOrIssue.trim(),
          preferredTime: preferredTime.trim(),
          userPhone: userPhone.trim(),
        },
        token
      );

      toast.success("تم إرسال تذكرتك بنجاح! سيقوم فريق المستشارين بمراجعتها والرد عليك.");
      setSubject("");
      setGoalOrIssue("");
      setPreferredTime("");
      setActiveTab("history");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء إرسال التذكرة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedTicket || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      await addReply(selectedTicket._id, replyMessage.trim(), token);
      toast.success("تم إرسال ردك بنجاح");
      setReplyMessage("");
      // Update selectedTicket reference
      const updated = myTickets.find((t) => t._id === selectedTicket._id);
      if (updated) setSelectedTicket(updated);
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الرد");
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> بانتظار رد المستشار</span>;
      case "in_progress":
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> قيد المراجعة والمتابعة</span>;
      case "resolved":
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> تم الرد والتوجيه</span>;
      case "closed":
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-full text-xs font-bold">مغلقة</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-4 select-none" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-border/50 p-8 md:p-12 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-extrabold border border-brand-primary/20">
                <Compass className="w-3.5 h-3.5" />
                <span>خدمة الإرشاد والتوجيه الأكاديمي</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight">
                استشارة توجيهية لبناء <span className="text-brand-primary">حياة أسرية متوازنة</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                في أسس، نساعدك على إعداد نفسك للحياة الزوجية والأسرية والتربية الواعية وفق أسس علمية في علم النفس والعلاقات. أرسل تذكرة استشارة تشرح فيها استفسارك أو التحدي الذي تواجهه، وسيوجهك المستشار إلى الدورة أو المقال الأنسب لظرفك.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 bg-background p-1.5 rounded-2xl border border-border shadow-inner self-stretch md:self-auto">
              <button
                onClick={() => { setActiveTab("new"); setSelectedTicket(null); }}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all",
                  activeTab === "new"
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                <PlusCircle className="w-4 h-4" />
                <span>طلب استشارة جديدة</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all relative",
                  activeTab === "history"
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                <span>تذاكري السابقة</span>
                {myTickets.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold flex items-center justify-center border border-brand-primary/30">
                    {myTickets.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === "new" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-surface rounded-3xl border border-border/50 p-6 md:p-10 shadow-lg">
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div>
                  <h2 className="text-xl font-black mb-1">تفاصيل طلب الاستشارة</h2>
                  <p className="text-xs text-text-secondary font-medium">كلما كانت التفاصيل أوضح، استطاع المستشار تقديم خطة دقيقة تناسبك.</p>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-primary block">
                    عنوان الاستشارة / المشكلة الرئيسية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: كيف أختار شريك الحياة المناسب؟ أو كيفية التعامل مع الخلافات في بداية الزواج"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 focus:border-brand-primary focus:outline-none text-sm transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-primary block">
                    مجال الاهتمام أو المشكلة <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => setCategory(cat.label)}
                        className={cn(
                          "p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col text-right",
                          category === cat.label
                            ? "bg-brand-primary/10 border-brand-primary text-text-primary shadow-sm"
                            : "bg-background border-border/40 hover:border-border text-text-secondary hover:text-text-primary"
                        )}
                      >
                        <span className="text-xs font-extrabold">{cat.label}</span>
                        <span className="text-[11px] opacity-75 mt-0.5 line-clamp-1">{cat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Life Stage */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-primary block">
                    المرحلة الحالية <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "single_or_engaged", label: "مقبل(ة) على الزواج / فترة الخطوبة", desc: "الاستعداد والتأهيل قبل الارتباط" },
                      { id: "married", label: "متزوج(ة) حديثاً أو منذ فترة", desc: "تطوير العلاقة وبناء التفاهم الزوجي" },
                      { id: "parent", label: "أب / أم (لدينا أبناء)", desc: "التربية الواعية والتعامل مع الأبناء" },
                    ].map((lvl) => (
                      <button
                        type="button"
                        key={lvl.id}
                        onClick={() => setCurrentLevel(lvl.id as any)}
                        className={cn(
                          "p-3.5 rounded-xl border text-center transition-all cursor-pointer",
                          currentLevel === lvl.id
                            ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 font-bold"
                            : "bg-background border-border/60 text-text-secondary hover:text-text-primary"
                        )}
                      >
                        <div className="text-xs font-bold">{lvl.label}</div>
                        <div className="text-[10px] opacity-85 mt-0.5">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed issue / goal */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-primary block">
                    شرح المشكلة بالتفصيل أو الهدف الذي تسعى لتحقيقه <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={goalOrIssue}
                    onChange={(e) => setGoalOrIssue(e.target.value)}
                    placeholder="اكتب هنا بالتفصيل: ما هو التحدي أو المشكلة التي تواجهك حالياً في علاقتك أو أسرتك؟ وما هي المساعدة أو التوجيه الذي تتمنى الحصول عليه؟"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 focus:border-brand-primary focus:outline-none text-sm transition-all resize-none"
                  />
                  <span className="text-[11px] text-text-secondary">الحد الأدنى 10 أحرف.</span>
                </div>

                {/* Phone & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-text-secondary" />
                      <span>رقم الهاتف / واتساب (اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="للتواصل السريع معك في حال تطلب الأمر"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/60 focus:border-brand-primary focus:outline-none text-xs transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-text-secondary" />
                      <span>الوقت المفضل للتواصل أو المحادثة</span>
                    </label>
                    <input
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="مثال: مساءً من 6:00 إلى 9:00"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/60 focus:border-brand-primary focus:outline-none text-xs transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري إرسال التذكرة...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>إرسال طلب الاستشارة للمستشار الأكاديمي</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Guide */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-surface rounded-3xl border border-border/50 p-6 shadow-md space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black">لماذا استشارة أكاديمية أسس؟</h3>
                <ul className="space-y-3 text-xs text-text-secondary leading-relaxed font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                    <span>توجيه علمي مدروس مبني على أحدث دراسات علم النفس والعلاقات الأسرية والتربية.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                    <span>خصوصية وسرية تامة لجميع البيانات والمشاكل المطروحة داخل التذكرة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                    <span>تحديد البرنامج التدريبي أو المقال العملي المناسب لحالتك لتطبيق الحلول واقعياً.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-brand-primary/10 via-surface to-surface rounded-3xl border border-brand-primary/20 p-6 space-y-3">
                <h4 className="text-sm font-black text-brand-primary">هل لديك سؤال سريع؟</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  يمكنك أيضاً استعراض الأسئلة الشائعة في الأكاديمية أو الدخول في غرف محادثة دوراتك لمناقشة المدرب مباشرة.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* History / My Tickets Tab */
          <div className="bg-surface rounded-3xl border border-border/50 p-6 md:p-8 shadow-xl">
            {myTickets.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-secondary/40 flex items-center justify-center mx-auto text-text-secondary">
                  <HelpCircle className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-black">لا توجد لديك أي تذاكر استشارة سابقة</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  إذا كنت ترغب في نصيحة أو لديك استفسار حول مسارك الأنسب، يمكنك تقديم طلب جديد الآن.
                </p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="px-6 py-2.5 bg-brand-primary text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  تقديم طلب استشارة الآن
                </button>
              </div>
            ) : selectedTicket ? (
              /* Ticket Details & Replies View */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة لقائمة التذاكر</span>
                  </button>
                  {getStatusBadge(selectedTicket.status)}
                </div>

                {/* Main Ticket Info */}
                <div className="bg-background rounded-2xl p-6 border border-border/60 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xl font-black text-text-primary">{selectedTicket.subject}</h2>
                    <span className="text-[11px] text-text-secondary font-medium">
                      تاريخ التقديم: {new Date(selectedTicket.createdAt).toLocaleDateString("ar-TN")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-surface border border-border rounded-lg font-bold">
                      المجال: {selectedTicket.category}
                    </span>
                    <span className="px-3 py-1 bg-surface border border-border rounded-lg font-bold">
                      المرحلة: {selectedTicket.currentLevel === "single_or_engaged" ? "مقبل على الزواج" : selectedTicket.currentLevel === "married" ? "متزوج" : selectedTicket.currentLevel === "parent" ? "أب / أم" : "أخرى"}
                    </span>
                    {selectedTicket.preferredTime && (
                      <span className="px-3 py-1 bg-surface border border-border rounded-lg font-bold">
                        الوقت المفضل: {selectedTicket.preferredTime}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <p className="text-xs text-text-secondary font-bold mb-1">تفاصيل المشكلة / الهدف:</p>
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line bg-surface/50 p-4 rounded-xl border border-border/30">
                      {selectedTicket.goalOrIssue}
                    </p>
                  </div>
                </div>

                {/* Conversation / Replies Section */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-black flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-primary" />
                    <span>محادثة وتوجيهات المستشار ({selectedTicket.replies?.length || 0})</span>
                  </h3>

                  {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-background border border-dashed border-border text-center text-xs text-text-secondary">
                      لم يتم إضافة ردود بعد من قبل المستشار. تذكرتك قيد المراجعة حالياً وستصلك إفادة قريباً.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket.replies.map((reply, idx) => {
                        const isAdmin = reply.senderRole === "admin" || reply.senderRole === "instructor";
                        return (
                          <div
                            key={reply._id || idx}
                            className={cn(
                              "p-4 rounded-2xl border text-right max-w-2xl",
                              isAdmin
                                ? "bg-brand-primary/10 border-brand-primary/30 mr-0 ml-auto"
                                : "bg-surface border-border ml-0 mr-auto"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={cn("text-xs font-black", isAdmin ? "text-brand-primary" : "text-text-primary")}>
                                {reply.senderName} {isAdmin && "(مستشار الأكاديمية)"}
                              </span>
                              <span className="text-[10px] text-text-secondary font-medium">
                                {new Date(reply.createdAt).toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-xs text-text-primary leading-relaxed whitespace-pre-line">
                              {reply.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="أضف تعقيباً أو سؤالاً إضافياً للمستشار..."
                      className="flex-1 px-4 py-3 rounded-xl bg-background border border-border/60 focus:border-brand-primary focus:outline-none text-xs transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isReplying}
                      className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>إرسال</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Ticket List Table/Cards */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-black">قائمة استشاراتك السابقة</h3>
                  <span className="text-xs text-text-secondary font-medium">{myTickets.length} تذكرة مسجلة</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-5 rounded-2xl bg-background hover:bg-surface border border-border/50 hover:border-brand-primary/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-text-primary truncate">{ticket.subject}</h4>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {ticket.goalOrIssue}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-text-secondary/80 font-medium">
                          <span>المجال: {ticket.category}</span>
                          <span>•</span>
                          <span>الردود: {ticket.replies?.length || 0}</span>
                          <span>•</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString("ar-TN")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-brand-primary text-xs font-bold shrink-0 self-end md:self-auto">
                        <span>عرض التفاصيل والردود</span>
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
