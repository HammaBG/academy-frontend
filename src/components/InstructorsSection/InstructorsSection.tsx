"use client";

import Link from "next/link";
import { ArrowLeft, User as UserIcon } from "lucide-react";

const teachers = [
  { id: "t1", name: "نايلة بن صالح", title: "طبيبة نفسية", image: "/teachers/1AI.png" },
  { id: "t2", name: "مريم رڤية", title: "طبيبة نفسية", image: "/teachers/2AI.png" },
  { id: "t3", name: "ريماح حناشي", title: "مختصة في الصحة النفسية", image: "/teachers/3AI.png" },
  { id: "t4", name: "إنصاف شرف", title: "مختصة في الصحة النفسية", image: "/teachers/4AI.png" },
  { id: "t5", name: "مريم عون", title: "مختصة في الصحة النفسية", image: "/teachers/5AI.png" },
  { id: "t6", name: "ليليا كمون", title: "أخصائية في التثقيف النفسي", image: "/teachers/6AI.png" },
  { id: "t7", name: "أسماء الأمين", title: "مهندسة و باحثة في علم الشريعة و الدين", image: "/teachers/7AI.png" },
  { id: "t10", name: "أمينة الرڨيڨ", title: "استشارية أسرية و خبيرة في العلاقات", image: "/teachers/10AI.png" },
  { id: "t8", name: "إنصاف عبد سلام", title: "طبيبة نساء و توليد", image: "/teachers/8AI.png" },
  { id: "t9", name: "إبراهيم بن عبد الله", title: "كوتش و مستشار في التفكير و التخطيط الإستراتيجي", image: "/teachers/9AI.png" },
  { id: "t11", name: "يسرى الجملي", title: "طبيبة نفسية و مختصة في علم الجنس و علاج الإدمان", image: "/teachers/13AI.png" },
  { id: "t12", name: "سنية مصمودي", title: "أستاذة فيزياء ورئيسة المنتدى التونسي لاضطرابات التعلم", image: "/teachers/11AI.png" },
  { id: "t13", name: "لطيفة الغزال", title: "مهندسة مدنية و أستاذة جامعية", image: "/teachers/14AI.png" },
  { id: "t14", name: "أميمة الشايب (Budgeteuse)", title: "مستشارة في إدارة الأموال و تحقيق الأهداف المالية", image: "/teachers/12AI.png" },
];

export function InstructorsSection() {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden border-t border-border/40 bg-background py-16 sm:py-20 text-right"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-text-primary sm:text-4xl">
              فريق <span className="text-brand-primary">الخبراء</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-text-secondary sm:text-base">
              تعرف على الخبراء في أكاديمية أسس والذين يقودون حياتكم نحو التميز والإبداع.
            </p>
          </div>

          <Link
            href="/instructors"
            className="group inline-flex items-center gap-2 self-start font-extrabold text-brand-primary transition-colors hover:text-brand-primary/80 md:self-auto"
          >
            <span>عرض جميع الخبراء</span>
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* 2 → 3 → 4 → 7 columns (7 x 2 rows = 14, no orphans on desktop) */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-7 lg:gap-x-4">
          {teachers.map((t) => (
            <li key={t.id}>
              <Link
                href="/instructors"
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {/* Portrait */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/40 bg-surface transition-colors duration-300 group-hover:border-brand-primary/60">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-secondary/40">
                      <UserIcon className="h-10 w-10" />
                    </div>
                  )}
                  {/* Accent bar grows on hover / focus */}
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-right scale-x-0 bg-brand-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                </div>

                {/* Text sits below the photo so long titles stay readable */}
                <div className="mt-3 px-0.5">
                  <h3 className="text-sm font-extrabold leading-snug text-text-primary transition-colors group-hover:text-brand-primary sm:text-base">
                    {t.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-[2.5em] text-xs font-medium leading-snug text-text-secondary">
                    {t.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-brand-primary px-8 py-3.5 font-black text-white shadow-lg shadow-brand-primary/10 transition-all hover:scale-105 hover:bg-brand-primary/90"
          >
            <span>عرض جميع الخبراء</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}