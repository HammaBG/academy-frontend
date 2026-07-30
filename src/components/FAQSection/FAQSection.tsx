"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "كيف يمكنني تفعيل كود الاشتراك في الموقع؟",
    answer: "يمكنك إدخال الكود التفعيلي مباشرةً في الحقل المخصص في قسم \"تفعيل كود الاشتراك\" في هذه الصفحة أو عبر صفحة التفعيل المخصصة، وسيتم تفعيل الكورسات المقترنة بالكود وإضافتها لحسابك فوراً."
  },
  {
    question: "هل أحصل على وصول مدى الحياة للمواد التعليمية؟",
    answer: "نعم، بمجرد الاشتراك في أي دورة أو تفعيل كود اشتراكها، ستحصل على إمكانية الوصول إلى كافة محاضراتها وموادها مدى الحياة، بما في ذلك أي تحديثات مستقبلية للمساق."
  },
  {
    question: "هل يمكنني الدراسة في أي وقت ومن أي جهاز؟",
    answer: "بالتأكيد، منصتنا متوافقة تماماً مع الهواتف الذكية، الأجهزة اللوحية، وأجهزة الكمبيوتر الشخصية. يمكنك متابعة دروسك بالوتيرة التي تناسبك في أي مكان وفي أي وقت."
  },
  {
    question: "هل تقدمون شهادات إتمام بعد انتهاء الدورة؟",
    answer: "نعم، يحصل كل طالب على شهادة إتمام رقمية معتمدة من المنصة بعد إكمال كافة الدروس وتجاوز الاختبارات أو التقييمات المقررة بنجاح."
  },
  {
    question: "كيف يمكنني طرح الأسئلة والتواصل مع المحاضرين؟",
    answer: "يمكنك طرح استفساراتك مباشرةً داخل قسم النقاشات المخصص لكل درس، أو التواصل المباشر مع الدعم التعليمي والمشرفين على المساق للحصول على توجيه وإجابات دقيقة."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border/40 text-right dir-rtl relative overflow-hidden">
      <div className="relative z-10">

        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            الأسئلة <span className="text-brand-primary">الشائعة</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl font-medium mt-2">
            إليك إجابات لأكثر الأسئلة تكراراً حول كيفية التسجيل، تفعيل الأكواد، والاستفادة القصوى من دوراتنا.
          </p>
        </div>

        {/* Accordion List Container */}
        <div className="max-w-3xl mx-auto w-full">

          {/* Accordion List */}
          <div className="flex flex-col gap-5">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`group border border-border/40 rounded-2xl transition-all duration-300 ${isOpen
                    ? "bg-surface-secondary/40 shadow-md border-brand-primary/20"
                    : "bg-surface hover:bg-surface-secondary/20"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-right outline-none cursor-pointer"
                  >
                    <span className="font-bold text-base md:text-lg text-text-primary group-hover:text-brand-primary transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-secondary transition-transform duration-300 shrink-0 mr-4 ${isOpen ? "transform rotate-180 text-brand-primary" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[300px] border-t border-border/20" : "max-h-0"
                      }`}
                  >
                    <p className="p-5 md:p-6 text-sm md:text-base text-text-secondary leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
