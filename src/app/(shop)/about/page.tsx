import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Heart, Lightbulb, BookOpen, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "عن الموقع - أكاديمية أسس",
  description: "منصة إلكترونية متخصصة في تنمية مهارات الأطفال، ودعم الأمهات والآباء في تنمية مهاراتهم التربوية مع أبنائهم.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pb-20 font-sans text-right" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-surface/10 pt-32 border-b border-border/40">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary leading-tight mb-6">
            أكاديمية <span className="text-brand-primary">أسس</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-text-secondary font-medium leading-relaxed">
            منصة إلكترونية متخصصة في تنمية مهارات الأطفال، ودعم الأمهات والآباء في تنمية مهاراتهم التربوية والتعليمية مع أبنائهم لبناء مستقبل واعد.
          </p>
        </div>
      </section>

      {/* Goals & Values Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-text-primary">
            أهدافنا ورسالتنا
          </h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Goal 1 */}
          <div className="bg-surface p-8 rounded-[32px] border border-border/40 shadow-sm hover:shadow-xl hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">
              تنمية قدرات الطفل
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed font-medium">
              تنمية القدرات العقلية والإبداعية للطفل، وتجهيزه ليكون متعدد المهارات، نابه العقل، وواسع المدارك.
            </p>
          </div>

          {/* Goal 2 */}
          <div className="bg-surface p-8 rounded-[32px] border border-border/40 shadow-sm hover:shadow-xl hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">
              دعم الأمهات والآباء
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed font-medium">
              تنمية مهاراتهم التربوية، لجعلهم أكثر قدرة على تحسين سلوك الأبناء وتوجيههم بوعي وحكمة.
            </p>
          </div>

          {/* Goal 3 */}
          <div className="bg-surface p-8 rounded-[32px] border border-border/40 shadow-sm hover:shadow-xl hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">
              محتوى علمي عالي الجودة
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed font-medium">
              توفير محتوى علمي متميز وبتكلفة مرنة لبناء أسرة متماسكة وناجحة قادرة على مواجهة التحديات.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-text-secondary font-bold text-base md:text-lg">
          وذلك من خلال مجموعة متنوعة من الدورات التدريبية والمسارات المتكاملة.
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-surface text-text-primary rounded-[32px] p-8 md:p-12 shadow-xl border border-border/40 relative overflow-hidden text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-4">
              هل أنت معلم أو مدرب؟
            </h2>
            <p className="text-text-secondary font-medium text-sm md:text-base leading-relaxed">
              إذا كنت تمتلك الخبرة والشغف لتعليم الأطفال وتطوير مهاراتهم، انضم إلينا اليوم وساهم في بناء جيل المستقبل.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-brand-primary/10 hover:scale-105"
            >
              <span>انضم كمدرب الآن</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
          {/* Ambient Design Blurs */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
