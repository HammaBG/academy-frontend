"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useEnrollmentCodeStore } from "@/store/enrollmentCode";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ActivateCodePage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const { token, isAuthenticated, isAuthLoading } = useAuthStore();
  const {
    isLoading,
    error: storeError,
    success,
    useCode,
    clearStatus
  } = useEnrollmentCodeStore();

  const [code, setCode] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return () => {
      unsubFinish();
    };
  }, []);

  useEffect(() => {
    clearStatus();
  }, [clearStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!code.trim()) {
      setValidationError("يرجى إدخال كود التفعيل.");
      return;
    }

    try {
      await useCode(code.trim(), token || "");
    } catch (err) {
      // Error is captured by store state
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        <p className="text-text-secondary text-sm font-semibold">جاري التحقق من الحساب...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-background/30 dir-rtl text-right">
      <div className="w-full max-w-lg bg-surface border border-border/40 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative space-y-6">

        {!isAuthenticated ? (
          // Not Authenticated State
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto text-brand-primary">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-text-primary">تسجيل الدخول مطلوب</h1>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                يرجى تسجيل الدخول أولاً إلى حسابك لتتمكن من تفعيل كود الاشتراك وإضافة الكورسات تلقائياً إلى ملفك الشخصي.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-44 py-6 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-sm shadow-md">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-44 py-6 border-border text-text-primary hover:bg-surface-secondary/50 font-bold rounded-xl text-sm">
                  إنشاء حساب جديد
                </Button>
              </Link>
            </div>
          </div>
        ) : success ? (
          // Success State
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-text-primary">تم تفعيل الاشتراك بنجاح!</h1>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                مبروك! تم تفعيل كود الاشتراك بنجاح وإضافة الكورسات المخصصة لك إلى حسابك مدى الحياة. يمكنك الآن البدء بالتعلم فوراً.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/my-courses" className="w-full sm:w-auto">
                <Button className="w-full sm:w-48 py-6 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>الذهاب إلى كورساتي</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => { clearStatus(); setCode(""); }}
                className="w-full sm:w-48 py-6 border-border text-text-primary hover:bg-surface-secondary/50 font-bold rounded-xl text-sm"
              >
                تفعيل كود آخر
              </Button>
            </div>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/20 pb-5">
              <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-text-primary">تفعيل كود الاشتراك</h1>
                <p className="text-xs text-text-secondary mt-0.5">سجل في الكورسات مدى الحياة باستخدام كود تفعيلي</p>
              </div>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">
              أدخل الكود التفعيلي المكون من حروف وأرقام للاشتراك الفوري والوصول مدى الحياة للكورسات المخصصة لك.
            </p>

            {(validationError || storeError) && (
              <div className="bg-[#F95353]/10 border border-[#F95353]/20 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-[#F95353] leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError || storeError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="code" className="text-xs font-bold text-text-secondary">
                رمز كود التفعيل
              </label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: CODE-1234"
                className="w-full px-5 py-3.5 bg-surface-secondary/40 border border-border rounded-2xl text-base focus:bg-surface focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all uppercase placeholder:normal-case font-mono tracking-wider text-right"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-6 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-brand-primary/95 transition-all mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تفعيل الكود...</span>
                </>
              ) : (
                <span>تأكيد الكود وتفعيله</span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
