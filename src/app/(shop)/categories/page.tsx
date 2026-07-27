"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/category";
import { Sparkles, ArrowLeft, FolderOpen } from "lucide-react";

export default function CategoriesPage() {
  const { categories, isLoading, error, getPublicCategories } = useCategoryStore();

  useEffect(() => {
    getPublicCategories();
  }, [getPublicCategories]);

  return (
    <div className="bg-background min-h-screen pb-20 font-sans text-right" dir="rtl">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 bg-surface/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary leading-tight mb-4">
            المسارات <span className="text-brand-primary">التعليمية</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-secondary font-medium leading-relaxed">
            استكشف المسارات المختلفة وابدأ رحلة التعلم اليوم مع أفضل الكورسات والبرامج التعليمية المتخصصة.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      </section>

      {/* Main Categories Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-center font-bold mb-8 border border-red-500/30">
            حدث خطأ أثناء تحميل المسارات: {error}
          </div>
        )}

        {isLoading ? (
          /* Loading State Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-surface/50 border border-border/40 p-8 flex flex-col justify-between animate-pulse"
              >
                <div className="w-12 h-12 bg-surface rounded-xl" />
                <div className="h-8 bg-surface rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-surface rounded-3xl border border-border/40 p-8 shadow-sm">
            <FolderOpen className="h-16 w-16 text-text-secondary/20 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد مسارات حالياً</h3>
            <p className="text-text-secondary text-sm mb-8 max-w-sm mx-auto font-medium">
              لم يتم إضافة أي مسارات تعليمية بعد، يرجى العودة لاحقاً أو استعراض جميع الكورسات.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold px-8 py-3 rounded-xl transition-all"
            >
              تصفح الكورسات
            </Link>
          </div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${encodeURIComponent(category.name)}`}
                className="relative group h-64 rounded-3xl overflow-hidden transition-all duration-500 shadow-sm flex flex-col justify-end p-8"
                style={{ borderColor: category.color }}
              >
                {/* Background Image / Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: category.color
                      }}
                    />
                  )}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-black/10 transition-colors" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-right">
                  <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">
                    {category.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-white/80 transition-colors text-sm font-bold mt-3">
                    <span>تصفح الكورسات</span>
                    <ArrowLeft className="h-4 w-4 transform transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
