"use client";

import { Course } from "@/store/course";
import {
  ShoppingBag,
  Zap,
  Infinity as InfinityIcon,
  Monitor,
  Trophy,
  Share2,
  Heart,
  Globe,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { usePreRegistrationStore } from "@/store/preRegistration";
import { PreRegistrationModal } from "@/components/Course/PreRegistrationModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { toggleFavorite, isInWishlist, isLoading } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { user, token, isAuthenticated } = useAuthStore();
  const { checkStatus } = usePreRegistrationStore();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsCheckingStatus(true);
    checkStatus(course.id, user?.email || undefined, token || undefined)
      .then((res) => {
        if (isMounted) {
          setIsPreRegistered(res.isRegistered);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [course.id, user?.email, token, checkStatus]);

  const courseInCart = isInCart(course.id);
  const isFavorited = isInWishlist(course.id);

  // Pre-registration discount calculation
  const hasPreRegDiscount = isPreRegistered && course.ready && (course.preregistration_discount || 0) > 0;
  const effectivePrice = hasPreRegDiscount
    ? Math.round(course.price * (1 - (course.preregistration_discount || 0) / 100))
    : course.price;

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (courseInCart) {
      removeFromCart(course.id);
      toast.success("تمت الإزالة من السلة");
      return;
    }

    // Add to cart with effectivePrice if discounted
    const courseToAdd = hasPreRegDiscount
      ? { ...course, price: effectivePrice, estimated_price: course.price }
      : course;

    const added = addToCart(courseToAdd);
    if (added) {
      toast.success(hasPreRegDiscount ? "تمت الإضافة إلى السلة بسعر الحجز المسبق المخفّض!" : "تمت الإضافة إلى السلة");
    } else {
      toast.info("الكورس موجود في السلة بالفعل");
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول أولاً");
      router.push("/login");
      return;
    }

    if (!token) {
      toast.error("حدث خطأ في المصادقة");
      return;
    }
    const result = await toggleFavorite(course.id, token);
    if (result) {
      toast.success("تمت الإضافة إلى المفضلة");
    } else {
      toast.success("تمت الإزالة من المفضلة");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      navigator.clipboard?.writeText(window.location.href);
      toast.success("تم نسخ رابط الدورة!");
    }
  };

  const discount = course.estimated_price
    ? Math.round(((course.estimated_price - course.price) / course.estimated_price) * 100)
    : 0;

  return (
    <div className="bg-surface/90 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-border/50 shadow-xl space-y-6 sm:space-y-7 animate-in fade-in slide-in-from-left-4 duration-500 text-right" dir="rtl">
      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {hasPreRegDiscount ? (
            <>
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {effectivePrice} د.ت
              </span>
              <span className="text-lg text-text-secondary/60 line-through font-bold">
                {course.price} د.ت
              </span>
              <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-500/20 animate-pulse">
                خصم الحجز المسبق {course.preregistration_discount}%
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl sm:text-4xl font-black text-brand-primary">{course.price} د.ت</span>
              {course.estimated_price && course.estimated_price > course.price && (
                <span className="text-lg text-text-secondary/60 line-through font-bold">{course.estimated_price} د.ت</span>
              )}
              {discount > 0 && (
                <span className="bg-brand-primary/15 text-brand-primary text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-primary/20 animate-pulse">
                  خصم {discount}%
                </span>
              )}
            </>
          )}
        </div>

        {hasPreRegDiscount ? (
          <p className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
            أنت مؤهل لخصم الحجز المسبق الخاص بك!
          </p>
        ) : !course.ready && (course.preregistration_discount || 0) > 0 ? (
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-current animate-bounce" />
            خصم حجز مسبق بنسبة {course.preregistration_discount}% عند الإطلاق!
          </p>
        ) : (
          <p className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
            عرض متاح للتسجيل الفوري
          </p>
        )}
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        {!course.ready ? (
          <>
            {isCheckingStatus ? (
              <Button disabled className="w-full h-14 font-black text-base rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحقق من الحجز...</span>
              </Button>
            ) : isPreRegistered ? (
              <div className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 font-black text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>أنت مسجل في الحجز المسبق!</span>
                </div>
                <p className="text-xs opacity-90 font-medium">
                  ستتلقى إشعاراً بريدياً وتخفيضاً خاصاً ({course.preregistration_discount || 0}%) فور توفر الدورة رسمياً.
                </p>
              </div>
            ) : (
              <Button
                onClick={() => setModalOpen(true)}
                className="w-full h-14 font-black text-base rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>
                  {(course.preregistration_discount || 0) > 0
                    ? `حجز مسبق بخصم ${course.preregistration_discount}%`
                    : "حجز مسبق بخصم حصري"}
                </span>
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleToggleCart}
            className={cn(
              "w-full h-14 font-black text-base rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99]",
              courseInCart
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : hasPreRegDiscount
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25"
                : "bg-brand-primary hover:bg-brand-primary/95 text-white shadow-brand-primary/25"
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {courseInCart
                ? "في السلة (إزالة)"
                : hasPreRegDiscount
                ? `اطلب الآن بسعر الحجز المسبق (${effectivePrice} د.ت)`
                : "أضف إلى السلة"}
            </span>
          </Button>
        )}
      </div>

      <p className="text-center text-text-secondary text-xs font-bold">
        {!course.ready
          ? "🎁 سجّل مجاناً بدون دفع الآن واضمن تخفيض الإطلاق المبكر"
          : "⚡ وصول فوري ومباشر لكافة الدروس بعد الاشتراك"}
      </p>

      {/* Pre-registration Modal */}
      {!course.ready && (
        <PreRegistrationModal
          course={course}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onRegisteredSuccess={() => setIsPreRegistered(true)}
        />
      )}

      {/* Highlights */}
      <div className="space-y-5 pt-4 border-t border-border/40">
        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider">تشمل هذه الدورة:</h4>
        <div className="space-y-3.5">
          {[
            { icon: Globe, text: "دورة 100% أونلاين", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: InfinityIcon, text: "وصول غير محدود مدى الحياة", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Monitor, text: "مشاهدة على الهواتف والشاشات", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Trophy, text: "شهادة إتمام معتمدة بعد الانتهاء", color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3.5 group">
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center border border-border/30 ${item.color} group-hover:scale-110 transition-transform shadow-xs shrink-0`}>
                <item.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share / Wishlist Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 h-11 rounded-xl bg-surface hover:bg-surface/80 border-border/50 text-text-primary font-bold gap-2 text-xs hover:border-brand-primary/40 transition-colors"
        >
          <Share2 className="w-4 h-4 text-brand-primary" /> مشاركة
        </Button>

        <Button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          variant="outline"
          className={cn(
            "flex-1 h-11 rounded-xl bg-surface hover:bg-surface/80 border-border/50 font-bold gap-2 text-xs transition-colors",
            isFavorited ? "text-red-500 border-red-500/30" : "text-text-primary hover:border-red-500/30"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
          ) : (
            <Heart className={cn("w-4 h-4", isFavorited && "fill-current text-red-500")} />
          )}
          <span>{isFavorited ? "المفضلة" : "إضافة للمفضلة"}</span>
        </Button>
      </div>
    </div>
  );
}