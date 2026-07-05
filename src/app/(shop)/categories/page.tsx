"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/category";

export default function CategoriesPage() {
  const { categories, isLoading, error, getPublicCategories } = useCategoryStore();

  useEffect(() => {
    getPublicCategories();
  }, [getPublicCategories]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-right" dir="rtl">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link href="/" className="hover:text-[#8b3d6f] transition-colors">
            الرئيسية
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#8b3d6f]">الأقسام</span>
        </div>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-[#8b3d6f]/10 via-white to-[#fbad26]/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            الأقسام <span className="text-[#8b3d6f]">التعليمية</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-gray-600 font-medium leading-relaxed">
            استكشف الأقسام المختلفة وابدأ رحلة التعلم اليوم مع أفضل الكورسات والبرامج التعليمية المتخصصة.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#8b3d6f]/5 to-[#fbad26]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold mb-8 border border-red-100">
            حدث خطأ أثناء تحميل الأقسام: {error}
          </div>
        )}

        {isLoading ? (
          /* Loading State Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-gray-100 p-8 flex flex-col justify-between animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد أقسام حالياً</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium text-sm">
              لم يتم إضافة أي أقسام تعليمية بعد، يرجى العودة لاحقاً أو استعراض جميع الكورسات.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-[#8b3d6f] hover:bg-[#76345e] text-white font-bold px-8 py-3 rounded-xl transition-all"
            >
              تصفح الكورسات
            </Link>
          </div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${encodeURIComponent(category.name)}`}
                className="relative group h-64 rounded-3xl overflow-hidden border border-gray-100 hover:border-[#fbad26]/50 transition-all duration-300 shadow-sm hover:shadow-xl bg-white flex flex-col justify-end p-8"
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
                    <div className="w-full h-full bg-gradient-to-br from-[#8b3d6f] to-[#512341]" />
                  )}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:via-black/20 transition-colors" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-right">
                  <h2 className="text-2xl font-black text-white group-hover:text-[#fbad26] transition-colors leading-tight drop-shadow-md">
                    {category.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-white/70 group-hover:text-white transition-colors text-sm font-bold mt-3">
                    <span>تصفح الكورسات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Accent Top Border Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#fbad26] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
