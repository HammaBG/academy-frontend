"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary py-16 px-4 relative overflow-hidden" dir="rtl">
      {/* Decorative ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6ba6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 leading-tight">
            شروط الخدمة والاستخدام
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl mx-auto">
            مرحباً بك في أكاديمية أسس. تحدد هذه الشروط والأحكام قواعد وأنظمة استخدام منصتنا التعليمية.
          </p>
          <div className="mt-4 text-xs font-semibold text-brand-primary/80 bg-brand-primary/10 px-4 py-1.5 rounded-full inline-block">
            آخر تحديث: 30 أغسطس 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-surface/40 backdrop-blur-xl border border-border/40 rounded-[32px] p-6 md:p-10 shadow-2xl space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              1. الموافقة على الشروط
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              بدخولك واستخدامك لأكاديمية أسس، فإنك تقر وتوافق على الالتزام الكامل بهذه الشروط. إذا كنت لا توافق على أي جزء منها، فلا يجوز لك استخدام المنصة أو الاستفادة من الخدمات والدروس المتاحة.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              2. الحساب والعضوية
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              عند إنشاء حساب في منصتنا، يجب عليك تقديم معلومات دقيقة وكاملة. أنت مسؤول بشكل كامل عن الحفاظ على سرية بيانات حسابك وكلمة المرور الخاصة بك، وعن أي أنشطة تتم من خلال حسابك.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              3. شراء الكورسات والاسترداد
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              يتم توفير محتوى الكورسات المدفوعة بعد الدفع الإلكتروني أو تفعيل الكود الخاص بالاشتراك. جميع المبيعات نهائية بمجرد بدء تشغيل ومشاهدة محتويات الكورس. قد تتوفر سياسة استرداد استثنائية في حالات فنية محددة يقررها فريق الدعم التقني بالأكاديمية.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              4. الملكية الفكرية وحقوق النشر
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              جميع محتويات الكورسات، الفيديوهات، النصوص، الصور، والشعارات في أكاديمية أسس هي ملك فكري حصري للأكاديمية ومدرسيها. يُمنع تماماً نسخ، أو تسجيل، أو نشر، أو مشاركة، أو إعادة بيع أي جزء من المحتوى التعليمي لأي شخص آخر دون موافقة خطية صريحة من إدارة الأكاديمية. سيؤدي أي انتهاك إلى إنهاء فوري للحساب والتعرض للمساءلة القانونية.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              5. قواعد السلوك في المنتديات والأسئلة
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              توفر المنصة ساحات نقاش لطرح الأسئلة وتبادل الفائدة حول محتوى الكورسات. يُتوقع من جميع الطلاب والمعلمين الحفاظ على الاحترام المتبادل وتجنب طرح أي نقاشات خارجة عن السياق التعليمي، أو استخدام لغة مسيئة، أو نشر روابط إعلانية. تحتفظ إدارة الأكاديمية بالحق في تعديل أو حذف أي محتوى يخالف هذه القواعد وتعليق حساب المخالف.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              6. تعديل الشروط والخدمات
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نحتفظ بالحق في تحديث أو تعديل هذه الشروط في أي وقت دون إشعار مسبق. تسري الشروط المعدلة فور نشرها على هذه الصفحة. نوصي بمراجعة هذه الصفحة بشكل دوري لمتابعة أي مستجدات.
            </p>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-sm text-text-secondary hover:text-brand-primary font-bold transition-colors underline decoration-dotted"
          >
            عرض سياسة الخصوصية
          </Link>
        </div>
      </div>
    </div>
  );
}
