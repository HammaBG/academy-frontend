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
  BookOpen,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { toggleFavorite, isInWishlist, isLoading } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const courseInCart = isInCart(course.id);
  const isFavorited = isInWishlist(course.id);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (courseInCart) {
      removeFromCart(course.id);
      toast.success("تمت الإزالة من السلة");
      return;
    }

    const added = addToCart(course);
    if (added) {
      toast.success("تمت الإضافة إلى السلة");
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
    <div className="bg-surface backdrop-blur-xl rounded-[32px] p-8 border border-border/40 shadow-xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 text-right" dir="rtl">
      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black text-brand-primary">{course.price} د.ت</span>
          {course.estimated_price && course.estimated_price > course.price && (
            <span className="text-lg text-text-secondary/60 line-through font-bold">{course.estimated_price} د.ت</span>
          )}
          {discount > 0 && (
            <span className="bg-brand-primary/15 text-brand-primary text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-primary/20">
              خصم {discount}%
            </span>
          )}
        </div>
        <p className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          عرض متاح للتسجيل الفوري
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleToggleCart}
          className={cn(
            "w-full h-14 font-extrabold text-base rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5",
            courseInCart
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
              : "bg-brand-primary hover:bg-brand-primary/95 text-white shadow-brand-primary/20"
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{courseInCart ? "في السلة (إزالة)" : "أضف إلى السلة"}</span>
        </Button>
      </div>

      <p className="text-center text-text-secondary text-[11px] font-bold uppercase tracking-widest">
        وصول سريع ومباشر بعد التسجيل
      </p>

      {/* Highlights */}
      <div className="space-y-6 pt-4 border-t border-border/40">
        <h4 className="text-xs font-black text-text-primary uppercase tracking-widest">تشمل هذه الدورة:</h4>
        <div className="space-y-4">
          {[
            { icon: InfinityIcon, text: "وصول مدى الحياة", color: "text-purple-500" },
            { icon: Monitor, text: "وصول على الهواتف والشاشات", color: "text-blue-500" },
            { icon: Trophy, text: "شهادة إتمام معتمدة", color: "text-amber-500" },
            { icon: BookOpen, text: `${course.course_data?.length || 0} موارد قابلة للتحميل`, color: "text-emerald-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`w-9 h-9 rounded-xl bg-surface flex items-center justify-center border border-border/40 ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <item.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share / Wishlist Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 h-12 rounded-xl bg-surface hover:bg-surface/80 border-border/40 text-text-primary font-bold gap-2 text-xs"
        >
          <Share2 className="w-4 h-4 text-brand-primary" /> مشاركة
        </Button>

        <Button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          variant="outline"
          className={cn(
            "flex-1 h-12 rounded-xl bg-surface hover:bg-surface/80 border-border/40 font-bold gap-2 text-xs transition-colors",
            isFavorited ? "text-red-500 border-red-500/30" : "text-text-primary"
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