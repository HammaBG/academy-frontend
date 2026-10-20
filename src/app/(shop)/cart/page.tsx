"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useFormStore } from "@/store/form";
import { useCouponStore } from "@/store/coupon";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Check,
  X,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCartStore();

  const {
    isLoading: formLoading,
    error: formError,
    success: formSuccess,
    submitForm,
    clearStatus: clearFormStatus,
  } = useFormStore();

  const {
    appliedCoupon,
    isValidating: couponLoading,
    error: couponError,
    successMessage: couponSuccess,
    applyCoupon,
    removeAppliedCoupon,
    clearMessages: clearCouponMessages,
  } = useCouponStore();

  useEffect(() => {
    return () => {
      clearFormStatus();
      clearCouponMessages();
    };
  }, [clearFormStatus, clearCouponMessages]);

  // COD Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // Promo Coupon Input State
  const [couponInput, setCouponInput] = useState("");

  // Local validation error State
  const [validationError, setValidationError] = useState<string | null>(null);

  const rawTotal = totalPrice();
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayableTotal = Math.max(0, Math.round((rawTotal - discountAmount) * 100) / 100);

  const isLoading = formLoading;
  const isSuccess = formSuccess;
  const errorMsg = validationError || formError;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const courseIds = items.map((item) => item.course.id);
    await applyCoupon(couponInput.trim(), rawTotal, courseIds);
  };

  const handleRemoveCoupon = () => {
    removeAppliedCoupon();
    setCouponInput("");
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
      // If a coupon is applied, apply discount proportionally to courses
      const submitPromises = items.map((item) => {
        let finalItemPrice = item.course.price;
        if (appliedCoupon && rawTotal > 0) {
          const ratio = item.course.price / rawTotal;
          finalItemPrice = Math.max(0, Math.round((item.course.price - (appliedCoupon.discountAmount * ratio)) * 100) / 100);
        }

        return submitForm({
          fullName: fullName.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          courseName: appliedCoupon ? `${item.course.name} [كود: ${appliedCoupon.code}]` : item.course.name,
          coursePrice: finalItemPrice,
          courseId: item.course.id,
        });
      });

      await Promise.all(submitPromises);

      // Reset the cart only if the store didn't record an error.
      if (!useFormStore.getState().error) {
        clearCart();
      }
    } catch (err) {
      // Error is already captured by form store
    }
  };

  // Success screen is checked BEFORE the cart/empty-cart UI,
  // so it stays visible even after clearCart() empties the items.
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
              شكراً لطلبك! لقد تم تسجيل معلوماتك بنجاح وسنتصل بك قريباً لتأكيد طلبك وتفعيل الكورسات.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link
              href="/"
              onClick={() => {
                clearFormStatus();
              }}
              className="inline-block w-full py-3.5 bg-brand-primary text-white rounded-xl font-extrabold hover:bg-brand-primary/90 transition-all text-center shadow-lg shadow-brand-primary/15"
            >
              العودة للرئيسية
            </Link>

            <Link
              href="/courses"
              onClick={() => {
                clearFormStatus();
              }}
              className="inline-block w-full py-3 bg-surface hover:bg-surface/80 text-text-primary border border-border/60 rounded-xl font-bold transition-all text-center text-sm"
            >
              استكشاف المزيد من الدورات
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
              <div className="bg-surface border border-border/40 p-6 md:p-7 rounded-[2.25rem] shadow-xl space-y-6 sticky top-28">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-black mb-2">
                    <Truck className="w-3.5 h-3.5" />
                    <span>التوصيل والدفع عند الاستلام</span>
                  </div>
                  <h2 className="text-xl font-black text-text-primary tracking-tight">
                    إتمام الطلب وتفعيل الكورسات
                  </h2>
                  <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                    ادفع نقداً عند استلام بطاقة تفعيل الدورة من المندوب في عنوانك.
                  </p>
                </div>

                {/* 3 Simple Visual Steps of the Process */}
                <div className="bg-background/70 border border-border/30 rounded-2xl p-3.5 space-y-2.5">
                  <div className="text-[11px] font-black text-text-primary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>كيف تتم عملية الشراء والتفعيل؟</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-surface p-2 rounded-xl border border-border/20 flex flex-col items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary text-[10px] font-black flex items-center justify-center mb-1">
                        1
                      </span>
                      <span className="text-[10px] font-bold text-text-primary leading-tight">سجل بياناتك</span>
                      <span className="text-[9px] text-text-secondary/80 mt-0.5">الاسم والعنوان</span>
                    </div>
                    <div className="bg-surface p-2 rounded-xl border border-border/20 flex flex-col items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary text-[10px] font-black flex items-center justify-center mb-1">
                        2
                      </span>
                      <span className="text-[10px] font-bold text-text-primary leading-tight">توصيل سريع</span>
                      <span className="text-[9px] text-text-secondary/80 mt-0.5">خلال 24-48 ساعة</span>
                    </div>
                    <div className="bg-surface p-2 rounded-xl border border-border/20 flex flex-col items-center">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-black flex items-center justify-center mb-1">
                        3
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 leading-tight">الدفع والتفعيل</span>
                      <span className="text-[9px] text-text-secondary/80 mt-0.5">ادفع واستلم كودك</span>
                    </div>
                  </div>
                </div>

                {/* Promo Coupon Code Section */}
                <div className="bg-background/60 p-4 rounded-2xl border border-border/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-primary" />
                      <span>هل لديك كود خصم؟</span>
                    </span>
                    {appliedCoupon && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-black border border-emerald-200">
                        مفعل
                      </span>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center font-mono font-black text-xs">
                          %
                        </div>
                        <div>
                          <div className="font-mono font-black text-sm">{appliedCoupon.code}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            وفرت {appliedCoupon.discountAmount} د.ت
                            {appliedCoupon.discountType === "percentage" && ` (${appliedCoupon.discountValue}%)`}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="p-1.5 hover:bg-emerald-500/20 rounded-md text-emerald-700 transition-colors"
                        title="إزالة الكوبون"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="أدخل كود الخصم (مثال: WELCOME20)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-border/40 bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-text-primary"
                        />
                        <button
                          type="submit"
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shadow-sm shrink-0"
                        >
                          {couponLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تطبيق</span>
                            </>
                          )}
                        </button>
                      </div>

                      {couponError && (
                        <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{couponError}</span>
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>{couponSuccess}</span>
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Subtotal & Final Breakdown */}
                <div className="bg-background/40 p-4 rounded-2xl border border-border/20 space-y-2.5">
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span>المجموع الفرعي للكورسات</span>
                    <span className="font-bold">{rawTotal} د.ت</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                      <span className="flex items-center gap-1">
                        <span>خصم الكوبون ({appliedCoupon.code})</span>
                      </span>
                      <span>- {discountAmount} د.ت</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-600" />
                      <span>مصاريف التوصيل لباب المنزل</span>
                    </span>
                    <span className="font-bold text-emerald-600">مجاناً (0 د.ت)</span>
                  </div>

                  <div className="pt-3 border-t border-border/30 flex justify-between items-center">
                    <div>
                      <span className="text-text-primary text-sm font-black block">المجموع المطلوب عند الاستلام</span>
                      <span className="text-[10px] text-text-secondary">شامل الضريبة وكافة الرسوم</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-brand-primary">
                        {finalPayableTotal}
                      </span>
                      <span className="text-text-secondary text-xs font-bold">د.ت</span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-[#F95353]/10 border border-[#F95353]/20 p-3.5 rounded-xl flex items-start gap-2.5 text-right text-xs text-[#F95353] leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Cash on Delivery Form */}
                <form onSubmit={handleCodSubmit} className="space-y-4">
                  <div className="border-t border-border/20 pt-4">
                    <span className="text-xs font-black text-text-primary block mb-3">
                      بيانات مستلم الطلب:
                    </span>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label htmlFor="fullName" className="text-xs font-bold text-text-secondary block">
                          الاسم واللقب <span className="text-[#F95353]">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                          <input
                            id="fullName"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="مثال: محمد بن علي"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="phoneNumber" className="text-xs font-bold text-text-secondary block">
                          رقم الهاتف (للاتصال والتوصيل) <span className="text-[#F95353]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                          <input
                            id="phoneNumber"
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="مثال: 98123456"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="address" className="text-xs font-bold text-text-secondary block">
                          عنوان التوصيل بالتفصيل (المدينة، الحي، الشارع) <span className="text-[#F95353]">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                          <input
                            id="address"
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="مثال: تونس، حي النصر 2، شارع الهادي نويرة"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-bold text-text-secondary block">
                          البريد الإلكتروني <span className="text-text-secondary/50 font-normal">(اختياري لإرسال إشعار التفعيل)</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border border-border/30 rounded-xl text-sm focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-left"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm hover:bg-brand-primary/95 transition-all shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] mt-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تأكيد وتسجيل الطلب...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>تأكيد الطلب والدفع عند الاستلام</span>
                      </>
                    )}
                  </button>

                  {/* Trust & Guarantee Badges */}
                  <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-text-secondary font-bold border-t border-border/20">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>دفع آمن 100% عند الاستلام</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                      <span>تفعيل فوري للكورس</span>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}