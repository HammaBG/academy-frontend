"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const { user, token, isAuthenticated, isAuthLoading, error, login, clearError } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  if (isAuthenticated && user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-gradient-to-br from-zinc-900 to-black font-sans text-zinc-100 p-4">
      <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 rounded-tl-[10px] rounded-br-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-2 tracking-tight text-center">تسجيل الدخول</h2>
          <p className="text-zinc-400 mb-8 text-center text-sm">أدخل بياناتك للوصول إلى حسابك</p>

          {error && (
            <div className="w-full p-3 mb-6 rounded-xl border text-sm text-center bg-red-500/10 border-red-500/50 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4" dir="rtl">
            <div className="space-y-1 text-right">
              <label className="text-xs font-medium text-zinc-400 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
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
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAuthLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-black/80 border-t-transparent rounded-full"></span>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          <div className="mt-8">
            <Link href="/signup" className="text-sm text-zinc-400 hover:text-white transition-colors underline decoration-dotted">
              ليس لديك حساب؟ سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
