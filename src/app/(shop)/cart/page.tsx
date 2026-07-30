"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useFormStore } from "@/store/form";
import { useEnrollmentCodeStore } from "@/store/enrollmentCode";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  Ticket,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();

  const {
    isLoading: formLoading,
    error: formError,
    success: formSuccess,
    submitForm,
    clearStatus: clearFormStatus
  } = useFormStore();

  const {
    isLoading: codeLoading,
    error: codeError,
    success: codeSuccess,
    useCode,
    clearStatus: clearCodeStatus
  } = useEnrollmentCodeStore();

  // Tab state: 'cod' | 'code'
  const [method, setMethod] = useState<'cod' | 'code'>('cod');

  // COD Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // Enrollment Code State
  const [enrollmentCode, setEnrollmentCode] = useState("");

  // Local validation error State
  const [validationError, setValidationError] = useState<string | null>(null);

  const isLoading = formLoading || codeLoading;
  const isSuccess = formSuccess || codeSuccess;
  const errorMsg = validationError || formError || codeError;

  const handleTabChange = (newMethod: 'cod' | 'code') => {
    setMethod(newMethod);
    setValidationError(null);
    clearFormStatus();
    clearCodeStatus();
  };

  // Handle Cash on Delivery (COD) Checkout
  const handleCodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    if (!fullName.trim() || !address.trim() || !phoneNumber.trim()) {
      setValidationError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const digitsCount = (phoneNumber.match(/\d/g) || []).length;
    if (digitsCount < 8) {
      setValidationError("يجب أن يحتوي رقم الهاتف على 8 أرقام على الأقل.");
      return;
    }

    try {
      // Submit form for each course in the cart in parallel using form store
      const submitPromises = items.map((item) => {
        return submitForm({
          fullName: fullName.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          courseName: item.course.name,
          coursePrice: item.course.price,
          courseId: item.course.id,
        });
      });

      await Promise.all(submitPromises);
      clearCart();
    } catch (err) {
      // Error is already captured by form store
    }
  };

  // Handle Enrollment Code Redemption
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isAuthenticated) {
      setValidationError("يرجى تسجيل الدخول أولاً لتفعيل كود الاشتراك.");
      return;
    }

    if (!enrollmentCode.trim()) {
      setValidationError("يرجى إدخال كود التفعيل.");
      return;
    }

    try {
      await useCode(enrollmentCode.trim(), token || "");
      clearCart();
    } catch (err) {
      // Error is already captured by enrollmentCode store
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex items-center justify-center px-4 py-20" dir="rtl">
        <div className="w-full max-w-md bg-surface border border-border/40 p-8 rounded-[2rem] shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">تمت العملية بنجاح!</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              {method === 'cod'
                ? "شكراً لطلبك! لقد تم تسجيل معلوماتك بنجاح وسنتصل بك قريباً لتأكيد طلبك وتفعيل الكورسات."
                : "تهانينا! لقد تم تفعيل الكورسات بنجاح وإضافتها إلى حسابك التعليمي."}
            </p>
          </div>
          <div className="pt-4">
            <Link
              href={method === 'cod' ? "/" : "/my-courses"}
              className="inline-block w-full py-3.5 bg-brand-primary text-white rounded-xl font-extrabold hover:bg-brand-primary/90 transition-all text-center shadow-lg shadow-brand-primary/15"
            >
              {method === 'cod' ? "العودة للرئيسية" : "اذهب إلى دوراتي"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary pt-24 pb-20" dir="rtl">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                سلة <span className="text-brand-primary">التسوق</span>
              </h1>
              <p className="text-text-secondary text-xs mt-0.5">
                {items.length > 0
                  ? `لديك ${items.length} ${items.length === 1 ? "كورس" : "كورسات"} في سلتك`
                  : "سلتك فارغة حالياً"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-1.5 text-text-secondary hover:text-brand-primary transition-colors text-sm font-bold w-fit"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface border border-dashed border-border/60 rounded-[2.5rem] p-8 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-surface-secondary/40 flex items-center justify-center mb-6 ring-8 ring-surface-secondary/10">
              <ShoppingCart className="w-10 h-10 text-text-secondary/40" />
            </div>
            <h2 className="text-xl font-black mb-2 text-text-primary">
              سلة التسوق فارغة
            </h2>
            <p className="text-text-secondary text-sm mb-8 max-w-sm leading-relaxed">
              لم تقم بإضافة أي كورسات بعد. تصفح مساراتنا التعليمية المتميزة وابدأ رحلتك التعليمية اليوم!
            </p>
            <Link
              href="/courses"
              className="px-8 py-3.5 bg-brand-primary text-white rounded-xl font-extrabold hover:bg-brand-primary/90 transition-all text-center shadow-lg shadow-brand-primary/15"
            >
              استكشف الكورسات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.course.id}
                    className="group flex gap-4 bg-surface border border-border/40 p-4 rounded-[2rem] hover:border-brand-primary/30 transition-all duration-300 shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 md:w-32 md:h-24 rounded-[1.25rem] overflow-hidden shrink-0 bg-background border border-border/30">
                      {item.course.thumbnail?.url ? (
                        <img
                          src={item.course.thumbnail.url}
                          alt={item.course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary/20">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 text-right">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-text-primary truncate mb-1">
                          {item.course.name}
                        </h3>
                        <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                          {item.course.short_description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
                        <button
                          onClick={() => removeFromCart(item.course.id)}
                          className="flex items-center gap-1.5 text-[#F95353] hover:text-[#f33d3d] text-xs font-black transition-colors"
                          aria-label={`إزالة ${item.course.name} من السلة`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>إزالة</span>
                        </button>

                        <div className="flex items-baseline gap-0.5">
                          <span className="text-text-secondary text-[10px] font-bold">DT</span>
                          <span className="text-xl font-black text-brand-primary tracking-tight">
                            {item.course.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear All */}
              <button
                onClick={clearCart}
                className="w-full py-3 text-xs font-bold text-text-secondary/70 hover:text-[#F95353] transition-colors border border-dashed border-border/60 rounded-xl hover:border-brand-primary/20 bg-surface/30 hover:bg-surface/50"
              >
                مسح جميع الكورسات من السلة
              </button>
            </div>

            {/* Checkout & Delivery Method Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-surface border border-border/40 p-6 rounded-[2rem] shadow-xl space-y-6 sticky top-28">
                <div>
                  <h2 className="text-lg font-black text-text-primary mb-1">
                    ملخص الطلب والدفع
                  </h2>
                  <p className="text-text-secondary text-xs">
                    اختر طريقة الدفع المناسبة لإتمام تسجيلك
                  </p>
                </div>

                {/* Subtotal */}
                <div className="bg-background/40 p-4 rounded-2xl border border-border/20 flex justify-between items-center">
                  <span className="text-text-secondary text-sm font-semibold">المجموع الإجمالي</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-text-secondary text-[10px] font-bold">DT</span>
                    <span className="text-2xl font-black text-brand-primary">
                      {totalPrice()}
                    </span>
                  </div>
                </div>

                {/* Payment Tabs Selection */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-background border border-border/20 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTabChange('cod')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${method === 'cod'
                      ? 'bg-brand-primary text-white shadow'
                      : 'text-text-secondary hover:text-text-primary'
                      }`}
                  >
                    الدفع عند الاستلام (COD)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('code')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${method === 'code'
                      ? 'bg-brand-primary text-white shadow'
                      : 'text-text-secondary hover:text-text-primary'
                      }`}
                  >
                    كود التفعيل
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-[#F95353]/10 border border-[#F95353]/20 p-3.5 rounded-xl flex items-start gap-2.5 text-right text-xs text-[#F95353] leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* COD Form */}
                {method === 'cod' && (
                  <form onSubmit={handleCodSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-text-secondary block">
                        الاسم الكامل <span className="text-[#F95353]">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثال: أحمد بن علي"
                          className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phoneNumber" className="text-xs font-bold text-text-secondary block">
                        رقم الهاتف <span className="text-[#F95353]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                        <input
                          id="phoneNumber"
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="مثال: 98765432"
                          className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="address" className="text-xs font-bold text-text-secondary block">
                        العنوان الكامل <span className="text-[#F95353]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                        <input
                          id="address"
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="مثال: شارع البيئة، تونس"
                          className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-text-secondary block">
                        البريد الإلكتروني <span className="text-text-secondary/50">(اختياري)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all text-left"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-primary text-white rounded-xl font-extrabold text-sm hover:bg-brand-primary/95 transition-colors shadow-lg shadow-brand-primary/10 mt-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري إرسال الطلب...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>تأكيد الطلب والدفع عند الاستلام</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Enrollment Code Form */}
                {method === 'code' && (
                  <form onSubmit={handleCodeSubmit} className="space-y-4">
                    {!isAuthenticated ? (
                      <div className="bg-surface-secondary/40 border border-border/20 p-5 rounded-2xl text-center space-y-4">
                        <p className="text-text-secondary text-xs leading-relaxed">
                          يجب تسجيل الدخول إلى حسابك لتتمكن من تفعيل كود الاشتراك والوصول إلى الكورسات.
                        </p>
                        <Link
                          href="/login"
                          className="inline-block px-6 py-2 bg-brand-primary text-white text-xs font-black rounded-lg hover:bg-brand-primary/90 transition-colors"
                        >
                          تسجيل الدخول
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label htmlFor="code" className="text-xs font-bold text-text-secondary block">
                            كود الاشتراك التفعيلي <span className="text-[#F95353]">*</span>
                          </label>
                          <div className="relative">
                            <Ticket className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                            <input
                              id="code"
                              type="text"
                              required
                              value={enrollmentCode}
                              onChange={(e) => setEnrollmentCode(e.target.value)}
                              placeholder="أدخل كود التفعيل هنا"
                              className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all uppercase placeholder:normal-case font-mono tracking-wider"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-primary text-white rounded-xl font-extrabold text-sm hover:bg-brand-primary/95 transition-colors shadow-lg shadow-brand-primary/10 mt-6"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>جاري تفعيل الكود...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تفعيل كود الاشتراك</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
