"use client";

import type { Course } from "@/store/course";
import { Heart, ShoppingCart, Star, Loader2, BookOpen, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { toggleFavorite, isInWishlist, isLoading } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const courseInCart = isInCart(course.id);
  const isFavorited = isInWishlist(course.id);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    e.stopPropagation();

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

  const categoryColor = course.category_color || "#F95353";
  const ratingValue = course.ratings ? course.ratings.toFixed(1) : "4.8";
  const categoryName = course.categories || "دورة تعليمية";

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border-2 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md text-right select-none"
      style={{ borderColor: categoryColor }}
    >
      {/* Top Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-background">
        {course.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-text-secondary/40" />
          </div>
        )}

        {/* Ambient Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Right: Category Tag */}
        <div
          className="absolute top-4 right-4 h-7 px-3.5 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg backdrop-blur-md"
          style={{ backgroundColor: categoryColor }}
        >
          {categoryName}
        </div>

        {/* Top Left: Wishlist Heart Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
          aria-label="المفضلة"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Heart className={cn("w-4 h-4 transition-colors", isFavorited ? "text-red-500 fill-current" : "text-white/90")} />
          )}
        </button>

        {/* Bottom Image Overlay: Instructor Avatar & Name */}
        <div className="absolute bottom-4 right-4 left-4 flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-full border-2 border-white/60 overflow-hidden bg-surface shrink-0 shadow-md">
            {course.creator?.avatar_url ? (
              <img
                src={course.creator.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-primary/20 text-white">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col text-right truncate">
            <span className="text-xs font-extrabold text-white leading-tight drop-shadow-md truncate">
              {course.creator?.first_name ? `${course.creator.first_name} ${course.creator.last_name || ""}` : "مدرب الأكاديمية"}
            </span>
            <span className="text-[10px] font-semibold text-white/80 truncate">
              {course.creator?.title || "خبير متخصص"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Rating & Level row */}
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{ratingValue}</span>
            </div>

            {course.level && (
              <span className="text-text-secondary bg-surface border border-border/40 px-2.5 py-1 rounded-full text-[11px]">
                {course.level}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
            {course.name}
          </h3>

          {/* Short Description */}
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed font-medium">
            {course.short_description || "تعلم أفضل المهارات التطبيقية والعملية في هذه الدورة المتميزة."}
          </p>
        </div>

        {/* Footer: Price & Add to Cart Action */}
        <div className="border-t border-border/40 pt-4 flex items-center justify-between gap-3 mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-xs font-extrabold text-text-secondary">DT</span>
            <span className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">
              {course.price}
            </span>
            {/* {course.estimated_price && course.estimated_price > course.price && (
              <span className="text-xs font-semibold text-text-secondary/50 line-through mr-1">
                {course.estimated_price} DT
              </span>
            )} */}
          </div>

          {/* Cart CTA Button */}
          <button
            onClick={handleToggleCart}
            className={cn(
              "px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all duration-300 shadow-md flex items-center gap-1.5 active:scale-95",
              courseInCart
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                : "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand-primary/20"
            )}
            aria-label={courseInCart ? "إزالة من السلة" : "إضافة إلى السلة"}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{courseInCart ? "في السلة" : "إضافة للسلة"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
