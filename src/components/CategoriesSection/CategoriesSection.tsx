"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Category } from "@/store/category";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-right">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            تصفح حسب <span className="text-brand-primary">المسارات</span>
          </h2>
        </div>
        <p className="text-text-secondary text-sm sm:text-base max-w-md">
          اختر المجال الذي يناسب طموحاتك وابدأ رحلتك التعليمية مع أفضل الخبراء المتخصصين.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Right Column: Big Featured Banner (RTL start) */}
        <div className="w-full lg:w-[28%] flex shrink-0">
          <div className="relative w-full rounded-2xl overflow-hidden border border-border/40 shadow-xl group min-h-[240px] lg:min-h-full bg-surface">
            <img
              src="/logo/logo.jpeg"
              alt="أكاديمية أسس"
              className="w-full h-full object-cover dark:hidden transition-transform duration-750 group-hover:scale-105"
            />
            <img
              src="/logo/logo.jpeg"
              alt="أكاديمية أسس"
              className="w-full h-full object-cover hidden dark:block transition-transform duration-750 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Left Column: Categories Grid (RTL end) */}
        <div className="w-full lg:w-[72%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${encodeURIComponent(category.name)}`}
                className="relative group h-40 rounded-2xl overflow-hidden transition-all shadow-xl"
                style={{ borderColor: category.color || "var(--border)" }}
              >
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
                  <div className="absolute inset-0 bg-black/10 transition-colors" />
                </div>

                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-black text-white drop-shadow-lg leading-tight">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/categories"
          className="px-10 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>كل المسارات</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
