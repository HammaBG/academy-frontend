"use client";

import { useState, useEffect, FormEvent, CSSProperties } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle, KeyRound, Inbox } from "lucide-react";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// Decorative blob positions and timing, so each one drifts differently.
const BLOBS: { cls: string; style: CSSProperties }[] = [
  { cls: "bg-[#F95353]/70", style: { top: "-6%", insetInlineStart: "-8%", width: "42%", height: "42%", animationDelay: "0s" } },
  { cls: "bg-[#FFB48A]/70", style: { bottom: "-10%", insetInlineEnd: "-6%", width: "46%", height: "46%", animationDelay: "-4s" } },
  { cls: "bg-[#7C3AED]/50", style: { top: "35%", insetInlineStart: "38%", width: "24%", height: "24%", animationDelay: "-8s" } },
];

export default function ForgotPasswordPage() {
  const { isAuthLoading, forgotPassword, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!isValidEmail(email)) {
      setFieldError("أدخل بريداً إلكترونياً صحيحاً.");
      return;
    }
    setFieldError(null);

    const address = email.trim();
    try {
      await forgotPassword(address);
      setSentTo(address);
    } catch {
      setServerError(useAuthStore.getState().error || "تعذر إرسال رابط الاستعادة. حاول مرة أخرى.");
    }
  };

  const fieldClass = `peer w-full rounded-2xl border-2 bg-white/80 px-12 py-3.5 text-[15px] font-semibold text-[#2c1a22] placeholder:text-[#2c1a22]/35 outline-none transition-all duration-300 focus:bg-white focus:border-[#F95353] focus:shadow-[0_0_0_5px_rgba(249,83,83,0.12)] disabled:opacity-60 ${
    fieldError ? "border-red-400 bg-red-50/60" : "border-[#eadcd9]"
  }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff4ef] text-[#2c1a22] flex items-center justify-center p-5" dir="rtl">
      <style>{`
        @keyframes forgot-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(2%, -3%, 0) scale(1.06); }
        }
        @keyframes forgot-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .forgot-blob { animation: forgot-float 14s ease-in-out infinite; filter: blur(70px); }
        .forgot-rise { animation: forgot-rise .7s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .forgot-blob, .forgot-rise { animation: none; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BLOBS.map((b, i) => (
          <span key={i} className={`forgot-blob absolute rounded-full ${b.cls}`} style={{ ...b.style, position: "absolute" }} />
        ))}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#2c1a22_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <main className="forgot-rise relative z-10 w-full max-w-md">
        <div className="rounded-[32px] border border-white/70 bg-white/75 p-8 shadow-[0_30px_80px_-20px_rgba(249,83,83,0.35)] backdrop-blur-xl md:p-10">
          {sentTo ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F95353] to-[#FF8A5C] text-white shadow-lg shadow-[#F95353]/30">
                <Inbox className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-black">تفقد بريدك الإلكتروني</h1>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-[#2c1a22]/70">
                أرسلنا رابط استعادة كلمة المرور إلى
                <span className="mx-1 block font-black text-[#2c1a22]" dir="ltr">{sentTo}</span>
                الرابط صالح لساعة واحدة. إذا لم تجده، تحقق من مجلد الرسائل غير المرغوب فيها.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setSentTo(null)}
                  className="rounded-2xl border-2 border-[#eadcd9] bg-white/80 px-4 py-3 text-sm font-black text-[#2c1a22] transition-colors hover:border-[#F95353] hover:text-[#F95353]"
                >
                  استخدام بريد آخر
                </button>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#F95353] to-[#FF7A4D] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-[#F95353]/30 transition-transform hover:-translate-y-0.5"
                >
                  <span>العودة لتسجيل الدخول</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F95353] to-[#FF8A5C] text-white shadow-lg shadow-[#F95353]/30">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black leading-tight">نسيت كلمة المرور؟</h1>
              <p className="mb-7 mt-2 text-sm font-semibold leading-relaxed text-[#2c1a22]/60">
                لا تقلق. أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإنشاء كلمة مرور جديدة.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {serverError && (
                  <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-black text-[#2c1a22]/70">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#2c1a22]/40" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!fieldError}
                      aria-describedby={fieldError ? "email-error" : undefined}
                      disabled={isAuthLoading}
                      placeholder="you@example.com"
                      dir="ltr"
                      className={fieldClass}
                    />
                  </div>
                  {fieldError && (
                    <p id="email-error" className="text-xs font-semibold text-red-600">{fieldError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#F95353] to-[#FF7A4D] px-4 py-4 text-base font-black text-white shadow-xl shadow-[#F95353]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#F95353]/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isAuthLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <span>إرسال رابط الاستعادة</span>
                      <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm font-semibold text-[#2c1a22]/60">
                تذكرت كلمة المرور؟{" "}
                <Link href="/login" className="inline-flex items-center gap-1 font-black text-[#F95353] hover:underline underline-offset-4">
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  <span>العودة لتسجيل الدخول</span>
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
