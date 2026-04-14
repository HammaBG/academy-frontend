"use client";

import { Course } from "@/store/course";
import { Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { toggleFavorite, isInWishlist, isLoading } = useWishlistStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const isFavorited = isInWishlist(course.id);

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

  const discount = course.estimated_price
    ? Math.round(((course.estimated_price - course.price) / course.estimated_price) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-zinc-100">
      {/* Visual Area */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Course Thumbnail */}
        {course.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

        {/* Header Overlay (Instructor) */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-start bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3 text-right">
            <div className="text-white">
              <h4 className="font-bold text-base leading-tight">
                {course.creator?.first_name} {course.creator?.last_name}
              </h4>
              <p className="text-[10px] text-white/80 font-medium">
                معلمة لغة عربية ومصممة مناهج
              </p>
            </div>
            <div className="relative w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden shadow-xl shrink-0">
              {course.creator?.avatar_url &&
                <img src={course.creator.avatar_url} alt="" className="w-full h-full object-cover" />
              }
            </div>
          </div>
        </div>

        {/* Content Overlay (Title) */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="space-y-1 text-right">
            <h3 className="text-2xl md:text-3xl font-black text-[#fbad26] leading-tight drop-shadow-lg">
              {course.name}
            </h3>
            <p className="text-white text-sm md:text-base font-bold drop-shadow-md">
              {course.short_description}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 flex items-center justify-between bg-white border-t border-zinc-100">
        <div className="flex items-center gap-4">
          <Link
            href={`/courses/${course.id}`}
            className="px-5 py-2 bg-[#17bed2] hover:bg-[#14a8ba] text-white text-sm font-black rounded-lg transition-colors shadow-sm"
          >
            اعرف أكثر
          </Link>
          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={cn(
              "transition-all duration-300 transform active:scale-90",
              isFavorited ? "text-red-500 fill-current" : "text-zinc-600 hover:text-red-500"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Heart className={cn("w-6 h-6", isFavorited && "fill-current")} />
            )}
          </button>
          <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-zinc-500 text-sm font-bold">DT</span>
          <span className="text-3xl font-black text-[#17bed2] tracking-tighter">
            {course.price}
          </span>
        </div>
      </div>
    </div>
  );
}
