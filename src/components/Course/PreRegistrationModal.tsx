"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { usePreRegistrationStore } from "@/store/preRegistration";
import { toast } from "sonner";
import { Clock, Sparkles, CheckCircle2, Phone, Mail, User, Loader2 } from "lucide-react";
import type { Course } from "@/store/course";

interface PreRegistrationModalProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisteredSuccess?: () => void;
}

export function PreRegistrationModal({
  course,
  open,
  onOpenChange,
  onRegisteredSuccess,
}: PreRegistrationModalProps) {
  const { user, token } = useAuthStore();
  const { registerPreRegistration, isLoading } = usePreRegistrationStore();

  const [fullName, setFullName] = useState(
    user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("يرجى إدخال الاسم بالكامل");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    const digitsCount = (phoneNumber.match(/\d/g) || []).length;
    if (digitsCount < 8) {
      toast.error("رقم الهاتف مطلوب ويجب أن يحتوي على 8 أرقام على الأقل");
      return;
    }

    try {
      const res = await registerPreRegistration(
        {
          courseId: course.id,
          courseName: course.name,
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        },
        token || undefined
      );

      setIsSubmitted(true);
      toast.success(res.message);
      onRegisteredSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء التسجيل";
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-surface border border-border/60 rounded-3xl p-6 sm:p-8 text-right font-sans" dir="rtl">
        {isSubmitted ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-text-primary">
                تم تسجيل حجزك المسبق بنجاح! 🎉
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                لقد أرسلنا لك رسالة تأكيد إلى بريدك الإلكتروني (<strong>{email}</strong>). بصفتك مسجلاً مبكراً، ستحصل على خصم استثنائي فور إطلاق دورة <strong>{course.name}</strong> وسنتواصل معك أولاً!
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleClose}
                className="w-full h-12 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold rounded-xl transition-all shadow-md"
              >
                حسناً، فهمت
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader className="space-y-2 text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-black w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>حجز مسبق بخصم حصري</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black text-text-primary">
                حجز مقعد في: {course.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                هذه الدورة قيد الإنتاج حالياً. سجل بياناتك الآن لحجز مقعدك مجاناً والحصول على <strong>سعر مخفّض خاص بالمسجلين الأوائل</strong> فور اكتمال الدورة.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                  <span>الاسم الكامل *</span>
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد علي"
                  className="h-11 rounded-xl bg-background border-border/50 font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-primary" />
                  <span>البريد الإلكتروني * (لتلقي إشعار الإطلاق)</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="h-11 rounded-xl bg-background border-border/50 font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-primary" />
                  <span>رقم الهاتف * (للتواصل وتأكيد الخصم)</span>
                </Label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="216 12 345 678"
                  className="h-11 rounded-xl bg-background border-border/50 font-bold text-sm"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري تسجيل الحجز...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>تأكيد الحجز المسبق مجاناً</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-center text-text-secondary/70">
                🔒 لا يلزم أي دفع الآن. الدفع سيكون عند الاستلام بالسعر المخفض فور إطلاق الدورة.
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
