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
  BookOpen
} from "lucide-react";
import Link from "next/link";

export function ActivateSection() {
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
      // Error is handled by store state
    }
  };

  if (!isHydrated) {
    return null; // Don't render until client store is ready to avoid UI shift
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border/40 text-right dir-rtl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f95353]/5 rounded-full filter blur-[80px] pointer-events-none -mr-48 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#f95353]/5 rounded-full filter blur-[60px] pointer-events-none -ml-36 -mb-10" />

      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
          تفعيل <span className="text-brand-primary">كود الاشتراك</span>
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl font-medium mt-2">
          سجل في الكورسات مدى الحياة باستخدام كود تفعيلي مخصص لك.
        </p>
      </div>

      <div className="relative z-10">
        <div className="bg-[#f95353] text-white border border-[#f95353]/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-8 items-center">

          {/* Left Column: Descriptive info */}
          <div className="flex-1 space-y-4 md:pl-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              هل حصلت على رمز تفعيل؟
            </h3>
            <p className="text-white/85 text-base leading-relaxed font-medium">
              قم بإدخال الرمز الخاص بك في الحقل المجاور للانضمام فوراً إلى الطلاب المشتركين والبدء في التعلم في أي وقت تريده.
            </p>
          </div>

          {/* Right Column: Interaction form */}
          <div className="w-full md:w-[400px] shrink-0 bg-white/10 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            {!isAuthenticated ? (
              // Not Authenticated State
              <div className="text-right space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mr-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">تسجيل الدخول مطلوب</h4>
                  <p className="text-white/80 text-xs leading-relaxed">
                    يرجى تسجيل الدخول أولاً لتتمكن من تفعيل كود الاشتراك وإضافة الكورسات إلى حسابك.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login" className="w-full">
                    <Button className="w-full py-5 bg-white hover:bg-white/95 text-[#f95353] font-bold rounded-xl text-xs shadow-md">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full py-5 border-white/20 text-black hover:bg-white/10 font-bold rounded-xl text-xs">
                      إنشاء حساب جديد
                    </Button>
                  </Link>
                </div>
              </div>
            ) : success ? (
              // Success State
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">تم التفعيل بنجاح!</h3>
                  <p className="text-white/80 text-xs leading-relaxed">
                    تم تفعيل الكود بنجاح وإضافة الكورسات المخصصة لك إلى حسابك.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/profile" className="w-full">
                    <Button className="w-full py-5 bg-white hover:bg-white/95 text-[#f95353] font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>الذهاب إلى كورساتي</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => { clearStatus(); setCode(""); }}
                    className="w-full py-5 border-white/20 text-white hover:bg-white/10 font-bold rounded-xl text-xs"
                  >
                    تفعيل كود آخر
                  </Button>
                </div>
              </div>
            ) : (
              // Active form state
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">تفعيل الكود</h3>
                  <p className="text-xs text-white/70">أدخل كود الاشتراك لتفعيل المساقات</p>
                </div>

                {(validationError || storeError) && (
                  <div className="bg-white/10 border border-white/20 p-3.5 rounded-xl flex items-start gap-2 text-xs text-white leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{validationError || storeError}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label htmlFor="homepage-code" className="text-xs font-bold text-white/80">
                    رمز كود التفعيل
                  </label>
                  <input
                    id="homepage-code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال: CODE-1234"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:border-white/50 focus:ring-1 focus:ring-white/20 outline-none transition-all uppercase placeholder:text-white/40 font-mono tracking-wider text-right text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-5 bg-white text-[#f95353] rounded-xl font-bold text-xs shadow-md hover:bg-white/95 transition-all mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري التفعيل...</span>
                    </>
                  ) : (
                    <span>تأكيد الكود وتفعيله</span>
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
