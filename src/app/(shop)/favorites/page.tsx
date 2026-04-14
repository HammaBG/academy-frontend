"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { Heart, Loader2, BookOpen } from "lucide-react";
import { CourseCard } from "@/app/(shop)/CourseCard";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (token) {
      fetchWishlist(token);
    }
  }, [fetchWishlist, token, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a0e16] text-white">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#8b3d6f]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black">
            قائمة <span className="text-[#fbad26]">المفضلة</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
            هنا تجد جميع الكورسات التي لفتت انتباهك وحفظتها للرجوع إليها لاحقاً.
          </p>
        </div>

        {isLoading && wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#fbad26] animate-spin mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">جاري تحميل المفضلة...</p>
          </div>
        ) : (
          <>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Heart className="w-16 h-16 text-white/5 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-400">لا توجد كورسات في المفضلة بعد</h3>
                <p className="text-zinc-500 text-sm">تصفح الكورسات وأضف ما يعجبك للمفضلة.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
