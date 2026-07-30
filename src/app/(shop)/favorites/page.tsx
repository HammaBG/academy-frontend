"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { Heart, BookOpen, ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/Course/CourseCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/ui/Loader";

export default function FavoritesPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

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
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isHydrated && token) {
      fetchWishlist(token);
    }
  }, [isHydrated, fetchWishlist, token, isAuthenticated, router]);

  if (!isHydrated) {
    return <Loader fullscreen size="lg" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background/30 text-text-primary relative overflow-x-hidden pt-24 pb-20 text-right dir-rtl" dir="rtl">

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* Banner Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-border/40 mb-12 gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-text-primary">
              قائمتي <span className="text-brand-primary">المفضلة</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-semibold">
              هنا تجد جميع الكورسات التي لفتت انتباهك وحفظتها للرجوع إليها لاحقاً.
            </p>
          </div>
          <div className="p-4 bg-brand-primary/10 text-brand-primary rounded-[2rem] shadow-sm">
            <Heart className="w-8 h-8 fill-current" />
          </div>
        </div>

        {/* Content Section */}
        {isLoading && wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader size="md" />
            <p className="text-text-secondary font-bold text-sm">جاري تحميل دوراتك المفضلة...</p>
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
              <div className="py-24 text-center bg-surface/50 border border-border/40 rounded-[3rem] shadow-xl max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto text-brand-primary">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-2 px-6">
                  <h3 className="text-2xl font-black text-text-primary">لا توجد كورسات في المفضلة بعد</h3>
                  <p className="text-text-secondary text-sm font-semibold max-w-md mx-auto leading-relaxed">
                    تصفح كورس الأكاديمية المتنوعة، واختر ما يناسب شغفك وأضف ما يعجبك للمفضلة بضغطة زر.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/courses">
                    <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-brand-primary/95 transition-all cursor-pointer">
                      <span>تصفح الكورسات المتاحة</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
