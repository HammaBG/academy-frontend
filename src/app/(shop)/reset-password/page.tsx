"use client";

import { useState, useEffect, FormEvent, ChangeEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

function ResetPasswordForm() {
  const { isAuthLoading, error, resetPassword, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (!token) {
      setLocalError("رابط إعادة تعيين كلمة المرور غير صالح أو مفقود.");
      return;
    }

    if (password.length < 6) {
      setLocalError("يجب أن تكون كلمة المرور 6 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("كلمات المرور غير متطابقة.");
      return;
    }

    try {
      await resetPassword(password, token);
      setSuccessMessage("تمت إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-border/40 rounded-[32px] p-8 shadow-2xl relative z-10">
      <div className="flex flex-col items-center">
        {/* Logo Frame */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-brand-primary/10 ring-2 ring-border/40 mb-6">
          <img
            src="/Ossos/OSSOS-ACADEMY-profile.png"
            alt="أكاديمية أسس"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-3xl font-black mb-2 text-text-primary text-center">تعيين كلمة المرور</h2>
        <p className="text-text-secondary mb-8 text-center text-sm font-semibold">أدخل كلمة المرور الجديدة الخاصة بحسابك</p>

        {(error || localError) && (
          <div className="w-full p-3 mb-6 rounded-xl border text-sm text-center bg-red-500/10 border-red-500/30 text-red-400 font-semibold">
            {localError || error}
          </div>
        )}

        {successMessage && (
          <div className="w-full p-3 mb-6 rounded-xl border text-sm text-center bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5" dir="rtl">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-text-secondary mr-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-text-secondary mr-1">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isAuthLoading || !token}
            className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl font-extrabold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20"
          >
            {isAuthLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full"></span>
            ) : (
              "حفظ كلمة المرور"
            )}
          </button>
        </form>

        <div className="mt-8">
          <Link href="/login" className="text-sm text-text-secondary hover:text-brand-primary transition-colors underline decoration-dotted font-bold">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary p-4 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6ba6]/5 rounded-full blur-[140px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-3 relative z-10">
          <span className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full"></span>
          <p className="text-text-secondary font-bold text-sm">جاري تحميل الصفحة...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}