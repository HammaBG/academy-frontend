"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { X, Send, Sparkles, MessageCircle, HelpCircle } from "lucide-react";
import { useCourseStore } from "@/store/course";

const WHATSAPP_PHONE_NUMBER = "21650120566";

interface QuickPrompt {
  id: string;
  label: string;
  text: string;
}

export function WhatsAppWidget() {
  const pathname = usePathname();
  const { currentCourse } = useCourseStore();

  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [hasUnreadBadge, setHasUnreadBadge] = useState(false);

  // Subtle delayed badge to attract attention after 3 seconds on initial visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasUnreadBadge(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Context-aware greeting based on active route
  const contextData = useMemo(() => {
    if (pathname.startsWith("/cart")) {
      return {
        tag: "مساعدة في إتمام الطلب",
        defaultMsg: "مرحباً، أود المساعدة في تأكيد طلبي وإتمام التوصيل والدفع عند الاستلام.",
        prompts: [
          {
            id: "cod-info",
            label: "كيف يتم الدفع عند الاستلام؟",
            text: "مرحباً، كيف تتم عملية الدفع عند الاستلام وكيف أستلم كود الكورس؟",
          },
          {
            id: "delivery-time",
            label: "كم يستغرق التوصيل؟",
            text: "مرحباً، كم يستغرق وصول المندوب إلى ولايتي؟",
          },
          {
            id: "coupon-help",
            label: "استفسار عن كود الخصم",
            text: "مرحباً، لدي استفسار بخصوص تفعيل كود الخصم في السلة.",
          },
        ] as QuickPrompt[],
      };
    }

    if (pathname.startsWith("/courses/") && currentCourse) {
      return {
        tag: `استفسار عن: ${currentCourse.name}`,
        defaultMsg: `مرحباً، أود الاستفسار عن تفاصيل دورة "${currentCourse.name}".`,
        prompts: [
          {
            id: "course-content",
            label: "هل الدورة مناسبة لي؟",
            text: `مرحباً، أود معرفة ما إذا كانت دورة "${currentCourse.name}" مناسبة لمستواي؟`,
          },
          {
            id: "course-cert",
            label: "هل توجد شهادة؟",
            text: `مرحباً، هل يحصل المشترك في دورة "${currentCourse.name}" على شهادة إتمام؟`,
          },
          {
            id: "course-order",
            label: "أريد الاشتراك الآن",
            text: `مرحباً، أود الاشتراك في دورة "${currentCourse.name}". ما هي الخطوات؟`,
          },
        ] as QuickPrompt[],
      };
    }

    if (pathname.startsWith("/consultation")) {
      return {
        tag: "حجز استشارة خاصة",
        defaultMsg: "مرحباً، أود الاستفسار عن جلسات الاستشارة النفسية والأسرية المتاحة.",
        prompts: [
          {
            id: "consult-types",
            label: "ما هي أنواع الاستشارات؟",
            text: "مرحباً، ما هي مجالات الاستشارات المتاحة ومواعيدها؟",
          },
          {
            id: "consult-book",
            label: "كيفية حجز موعد",
            text: "مرحباً، كيف يمكنني حجز موعد استشارة مع الأخصائي؟",
          },
        ] as QuickPrompt[],
      };
    }

    // Default site-wide
    return {
      tag: "خدمة العملاء والتوجيه",
      defaultMsg: "مرحباً أكاديمية أسس، لدي استفسار بخصوص الكورسات والتسجيل.",
      prompts: [
        {
          id: "general-course",
          label: "ما هي أفضل دورة تناسبني؟",
          text: "مرحباً، أود نصيحة لاختيار الدورة المناسبة لي في الأكاديمية.",
        },
        {
          id: "general-payment",
          label: "طرق الدفع والتوصيل",
          text: "مرحباً، ما هي طرق الدفع المتاحة لتسجيل الكورسات؟",
        },
        {
          id: "general-access",
          label: "هل الكورسات مسجلة مدى الحياة؟",
          text: "مرحباً، هل يظل المحتوى متاحاً لي مدى الحياة بعد الاشتراك؟",
        },
      ] as QuickPrompt[],
    };
  }, [pathname, currentCourse]);

  const handleSendToWhatsApp = (textToSend: string) => {
    const finalMsg = textToSend.trim() || contextData.defaultMsg;
    const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setCustomMessage("");
    setHasUnreadBadge(false);
  };

  const handleOpenToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasUnreadBadge(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none" dir="rtl">
      {/* Interactive Popover Box */}
      {isOpen && (
        <div className="mb-3 w-[330px] sm:w-[360px] bg-surface/95 backdrop-blur-xl border border-border/60 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 left-3.5 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
              aria-label="إغلاق المحادثة"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
                  <FaWhatsapp className="w-6 h-6 text-white" />
                </div>
                {/* Online pulse indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white ring-2 ring-emerald-500/20 animate-pulse" />
              </div>

              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>فريق أكاديمية أسس</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  <span className="text-[11px] text-emerald-100 font-medium">
                    متواجدون للرد ومساعدتك الآن
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Context Badge */}
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{contextData.tag}</span>
          </div>

          {/* Body: Agent Greeting & Quick Action Chips */}
          <div className="p-4 space-y-3.5 bg-surface/50">
            {/* Incoming Message Bubble */}
            <div className="bg-background/80 border border-border/40 p-3 rounded-2xl rounded-tr-none text-xs text-text-primary leading-relaxed shadow-sm">
              أهلاً بك! 👋 كيف يمكننا مساعدتك اليوم؟ يمكنك اختيار سؤال شائع أدناه أو كتابة استفسارك مباشرة:
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-text-secondary flex items-center gap-1 mb-1">
                <HelpCircle className="w-3 h-3 text-brand-primary" />
                <span>أسئلة سريعة شائعة:</span>
              </div>
              {contextData.prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSendToWhatsApp(prompt.text)}
                  className="w-full text-right p-2.5 rounded-xl text-xs font-bold bg-background hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 border border-border/40 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <span className="truncate">{prompt.label}</span>
                  <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 mr-1" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendToWhatsApp(customMessage);
              }}
              className="pt-2 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="اكتب استفسارك هنا..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-border/50 bg-background text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shrink-0"
                aria-label="إرسال عبر واتساب"
                title="إرسال إلى واتساب"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleOpenToggle}
        className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Animated unread indicator */}
        {hasUnreadBadge && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white text-[9px] font-black items-center justify-center text-white">
              1
            </span>
          </span>
        )}

        <FaWhatsapp className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300 shrink-0" />
        <span className="text-xs font-black tracking-wide hidden sm:inline-block">
          تواصل معنا
        </span>
      </button>
    </div>
  );
}
