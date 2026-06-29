"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    clearError();
    await signup(email, password, firstName, lastName, phone);
    const currentError = useAuthStore.getState().error;
    if (!currentError) {
      setSuccessMsg("تم التسجيل بنجاح! يرجى تسجيل الدخول.");
    }
  };

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0e16] to-[#2c1a25] text-white p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#fbad26] to-[#ff6ba6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fbad26]/20 mb-6 rounded-tl-[10px] rounded-br-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-2 tracking-tight text-center">إنشاء حساب جديد</h2>
          <p className="text-zinc-400 mb-8 text-center text-sm">سجل الآن للبدء في استخدام منصتنا</p>

          {(error || successMsg) && (
            <div className={`w-full p-3 mb-6 rounded-xl border text-sm text-center ${error ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
              {error || successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4" dir="rtl">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="space-y-1 w-full text-right">
                <label className="text-xs font-medium text-zinc-400 mr-1">الاسم الأول</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] transition-all text-right"
                  placeholder="الاسم"
                />
              </div>
              <div className="space-y-1 w-full text-right">
                <label className="text-xs font-medium text-zinc-400 mr-1">الاسم الأخير</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] transition-all text-right"
                  placeholder="اللقب"
                />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <label className="text-xs font-medium text-zinc-400 mr-1">رقم الهاتف <span className="text-zinc-500">(اختياري)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] transition-all text-right"
                placeholder="+966 5x xxx xxxx"
                dir="ltr"
              />
            </div>
            <div className="space-y-1 text-right">
              <label className="text-xs font-medium text-zinc-400 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] transition-all text-right"
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>
            <div className="space-y-1 pb-2 text-right">
              <label className="text-xs font-medium text-zinc-400 mr-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f] transition-all text-right"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#fbad26] to-[#ff6ba6] hover:opacity-90 text-white rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-[#fbad26]/20"
            >
              {isAuthLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full"></span>
              ) : (
                "إنشاء حساب"
              )}
            </button>
          </form>

          <div className="mt-8">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-[#fbad26] transition-colors underline decoration-dotted">
              لديك حساب بالفعل؟ سجل دخولك
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
