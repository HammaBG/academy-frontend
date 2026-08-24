"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function ForgotPasswordPage() {
  const { isAuthLoading, error, forgotPassword, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    try {
      await forgotPassword(email);
      setSuccessMessage("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.");
      setEmail("");
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary p-4 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6ba6]/5 rounded-full blur-[140px] pointer-events-none" />

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

          <h2 className="text-3xl font-black mb-2 text-text-primary text-center">استعادة كلمة المرور</h2>
          <p className="text-text-secondary mb-8 text-center text-sm font-semibold">أدخل بريدك الإلكتروني لإرسال رابط الاستعادة</p>

          {error && (
            <div className="w-full p-3 mb-6 rounded-xl border text-sm text-center bg-red-500/10 border-red-500/30 text-red-400 font-semibold">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="w-full p-3 mb-6 rounded-xl border text-sm text-center bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5" dir="rtl">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-text-secondary mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl font-extrabold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20"
            >
              {isAuthLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full"></span>
              ) : (
                "إرسال رابط الاستعادة"
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
    </div>
  );
}