"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignupPage() {
  const { isAuthenticated, isAuthLoading, error, signup, clearError } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    clearError();
    await signup(email, password, firstName, lastName, phone);
    const currentError = useAuthStore.getState().error;
    if (!currentError) {
      setSuccessMsg("تم التسجيل بنجاح! يرجى تسجيل الدخول.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary p-4 relative overflow-hidden">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff6ba6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-border/40 rounded-[32px] p-8 shadow-2xl relative z-10 my-8">
        <div className="flex flex-col items-center">
          {/* Logo Frame */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-brand-primary/10 ring-2 ring-border/40 mb-6">
            <img
              src="/Ossos/OSSOS-ACADEMY-profile.png"
              alt="أكاديمية أسس"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-3xl font-black mb-2 text-text-primary text-center">إنشاء حساب جديد</h2>
          <p className="text-text-secondary mb-8 text-center text-sm font-semibold">سجل الآن للبدء في استخدام منصتنا</p>

          {(error || successMsg) && (
            <div
              className={`w-full p-3 mb-6 rounded-xl border text-sm text-center font-semibold ${error ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"
                }`}
            >
              {error || successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4" dir="rtl">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="space-y-1.5 w-full text-right">
                <label className="text-xs font-bold text-text-secondary mr-1">الاسم الأول</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                  className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
                  placeholder="الاسم"
                />
              </div>
              <div className="space-y-1.5 w-full text-right">
                <label className="text-xs font-bold text-text-secondary mr-1">الاسم الأخير</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                  className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
                  placeholder="اللقب"
                />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-text-secondary mr-1">
                رقم الهاتف <span className="text-text-secondary/60"></span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full bg-surface border border-border/40 rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right"
                placeholder="+216 xx xxx xxx"
                dir="ltr"
              />
            </div>
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
            <div className="space-y-1.5 pb-2 text-right">
              <label className="text-xs font-bold text-text-secondary mr-1">كلمة المرور</label>
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

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl font-extrabold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20"
            >
              {isAuthLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full"></span>
              ) : (
                "إنشاء حساب"
              )}
            </button>
          </form>

          <div className="w-full flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-border/30" />
            <span className="text-[10px] font-extrabold text-text-secondary/60 tracking-wider">أو التسجيل بواسطة</span>
            <div className="flex-1 h-[1px] bg-border/30" />
          </div>

          <div className="flex items-center justify-center">
            <GoogleSignInButton />
          </div>

          <div className="mt-6">
            <Link href="/login" className="text-sm text-text-secondary hover:text-brand-primary transition-colors underline decoration-dotted font-bold">
              لديك حساب بالفعل؟ سجل دخولك
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
