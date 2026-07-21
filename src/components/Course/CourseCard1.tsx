"use client";

import type { Course } from "@/store/course";
import { Heart, ShoppingCart, Star, Loader2, BookOpen } from "lucide-react";
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

    return (
        <Link
            href={`/courses/${course.id}`}
            className="group relative flex flex-col justify-between p-6 aspect-[4/5] rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-lg select-none text-right"
            style={{
                background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}bb)`,
            }}
        >
            {/* Decorative ambient background light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

            {/* Top Row: Title/Subtitle (RTL) & Rating Pill */}
            <div className="relative z-10 flex items-start justify-between gap-4 w-full">
                {/* Rating Pill (Left) */}
                <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/15 text-white text-xs sm:text-sm font-black shadow-sm">
                    <span>{ratingValue}</span>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                </div>

                {/* Title & Subtitle (Right) */}
                <div className="space-y-0.5 max-w-[70%]">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate drop-shadow-md">
                        {course.name}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm font-medium truncate drop-shadow-sm">
                        {course.short_description}
                    </p>
                </div>
            </div>

            {/* Center Floating Thumbnail (inspired by Kirby frame) */}
            <div className="relative z-10 my-auto flex items-center justify-center">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transition-transform duration-700 group-hover:scale-105 bg-black/10 flex items-center justify-center">
                    {course.thumbnail?.url ? (
                        <img
                            src={course.thumbnail.url}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <BookOpen className="w-16 h-16 text-white/30" />
                    )}
                </div>
            </div>

            {/* Bottom Glassmorphic Actions & Info Footer */}
            <div className="relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 shadow-lg">
                {/* Right side: Price */}
                <div className="flex items-baseline gap-0.5 text-white text-right">
                    <span className="text-[10px] sm:text-xs font-bold text-white/80">DT</span>
                    <span className="text-xl sm:text-2xl font-black tracking-tight">{course.price}</span>
                </div>

                {/* Center/Left: Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Wishlist Button */}
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isLoading}
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform active:scale-95 bg-white/10 border border-white/10 hover:bg-white/20",
                            isFavorited ? "text-red-400" : "text-white/80 hover:text-white"
                        )}
                        aria-label="المفضلة"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                            <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                        )}
                    </button>

                    {/* Cart Button */}
                    <button
                        onClick={handleToggleCart}
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform active:scale-95 bg-white/10 border border-white/10 hover:bg-white/20",
                            courseInCart ? "text-yellow-400" : "text-white/80 hover:text-white"
                        )}
                        aria-label={courseInCart ? "إزالة من السلة" : "إضافة إلى السلة"}
                    >
                        <ShoppingCart className={cn("w-4 h-4", courseInCart && "fill-current")} />
                    </button>

                    {/* Learn More Button */}
                    <div className="px-3.5 py-1.5 bg-white text-black hover:bg-white/90 text-xs font-extrabold rounded-lg transition-all duration-300 shadow-sm">
                        اعرف أكثر
                    </div>
                </div>
            </div>
        </Link>
    );
}
