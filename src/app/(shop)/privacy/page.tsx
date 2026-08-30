"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary py-16 px-4 relative overflow-hidden" dir="rtl">
      {/* Decorative ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6ba6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 leading-tight">
            سياسة الخصوصية
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl mx-auto">
            في أكاديمية أسس، نلتزم بحماية خصوصيتك وأمن بياناتك الشخصية. توضح هذه الصفحة كيفية جمع واستخدام وحماية معلوماتك.
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
              1. المعلومات التي نجمعها
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نقوم بجمع المعلومات اللازمة لتزويدك بتجربة تعليمية مخصصة وآمنة، وتشمل:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm md:text-base pr-8">
              <li>بيانات الحساب: الاسم الكامل، البريد الإلكتروني، ورقم الهاتف عند التسجيل.</li>
              <li>بيانات التفاعل الدراسي: الكورسات المسجلة، تقدمك في الدروس، والأسئلة والأجوبة في المنتدى الدراسي.</li>
              <li>الملفات الشخصية: الصورة الشخصية (الرمز التعبيري)، وروابط شبكات التواصل (مثل LinkedIn) والسيرة الذاتية للمعلمين والطلاب.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              2. كيف نستخدم معلوماتك
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نستخدم البيانات التي نجمعها للأغراض التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm md:text-base pr-8">
              <li>تقديم الكورسات والدروس وإدارة تقدمك التعليمي والشهادات المكتسبة.</li>
              <li>تحسين خدمات الأكاديمية وتقديم الدعم الفني وتسهيل التواصل بين المعلمين والطلاب.</li>
              <li>إرسال الإشعارات التعليمية وإعادة تعيين كلمات المرور وتأكيد التسجيلات.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              3. أمن وحماية البيانات
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نحن نطبق أعلى معايير الأمان لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفشاء. يتم تشفير كلمات المرور باستخدام تقنيات تشفير قوية (bcrypt)، ويتم تأمين الاتصال بين المتصفح والخادم عبر شهادات اتصال آمنة (SSL/TLS).
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              4. مشاركة المعلومات مع أطراف ثالثة
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نحن لا نبيع أو نؤجر بياناتك الشخصية لأي جهة خارجية. قد نقوم بمشاركة بعض البيانات الضرورية فقط مع خدمات الطرف الثالث الموثوقة لدينا لإنجاز العمليات الأساسية (مثل استخدام خوادم الإرسال لإرسال بريد إعادة تعيين كلمة المرور أو خدمات التخزين السحابي لرفع الصور الشخصية).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              5. ملفات تعريف الارتباط (Cookies)
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              نستخدم ملفات تعريف الارتباط والتقنيات المماثلة لحفظ جلسة تسجيل الدخول وتذكر تفضيلاتك التعليمية لضمان تجربة مستخدم سلسة أثناء التنقل داخل الأكاديمية.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              6. حقوقك وخياراتك
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              لك الحق في الوصول إلى معلوماتك الشخصية أو تعديلها من خلال لوحة التحكم الخاصة بحسابك في أي وقت. إذا كنت ترغب في حذف حسابك نهائياً وإزالة جميع بياناتك من خوادمنا، يرجى التواصل معنا عبر البريد المعتمد للأكاديمية.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              7. التواصل معنا
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base pr-5">
              إذا كانت لديك أي استفسارات أو أسئلة حول سياسة الخصوصية الخاصة بنا، يمكنك التواصل معنا مباشرة على البريد الإلكتروني:
            </p>
            <div className="bg-surface border border-border/40 rounded-2xl p-4 inline-block font-extrabold text-brand-primary hover:text-brand-primary/80 transition-colors">
              <a href="mailto:academyossos@gmail.com" dir="ltr">
                academyossos@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/terms"
            className="text-sm text-text-secondary hover:text-brand-primary font-bold transition-colors underline decoration-dotted"
          >
            عرض شروط الخدمة والاستخدام
          </Link>
        </div>
      </div>
    </div>
  );
}
