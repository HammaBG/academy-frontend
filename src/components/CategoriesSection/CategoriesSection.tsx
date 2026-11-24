"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/store/category";

interface CategoriesSectionProps {
  categories: Category[];
}

const ITEMS_PER_SLIDE = 4;
const AUTO_PLAY_INTERVAL = 3500;

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Mobile slides of 4 categories each (up to 16 categories for mobile carousel)
  const mobileSlides = useMemo(() => {
    const activeCategories = categories.length > 0 ? categories : [];
    const slides: Category[][] = [];
    for (let i = 0; i < activeCategories.length; i += ITEMS_PER_SLIDE) {
      slides.push(activeCategories.slice(i, i + ITEMS_PER_SLIDE));
    }
    return slides;
  }, [categories]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = mobileSlides.length;

  const handleNextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // In RTL, swiping left means next slide, swiping right means previous slide
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  }, [handleNextSlide, handlePrevSlide]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 sm:py-20 text-right">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary">
            تصفح حسب <span className="text-brand-primary">المسارات</span>
          </h2>
        </div>
        <p className="text-text-secondary text-sm sm:text-base max-w-md">
          اختر المجال الذي يناسب احتياجاتك وابدأ رحلة واعية نحو حياة أسرية أكثر استقراراً، من خلال محتوى متخصص ومبني على أسس علمية.
        </p>
      </div>

      {/* MOBILE VIEW: No large image, 4-by-4 (2x2 grid per slide) auto-switch carousel */}
      <div
        className="block lg:hidden"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {totalSlides > 0 ? (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${currentSlide * 100}%)`,
              }}
            >
              {mobileSlides.map((slideGroup, slideIdx) => (
                <div
                  key={`slide-${slideIdx}`}
                  className="w-full shrink-0 grid grid-cols-2 gap-3 px-1"
                >
                  {slideGroup.map((category) => (
                    <Link
                      key={category.id}
                      href={`/courses?category=${encodeURIComponent(category.name)}`}
                      className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-white/20 transition-all shadow-sm active:scale-95 text-center min-h-[110px] text-white"
                      style={{
                        backgroundColor: category.color || "var(--brand-primary, #0284c7)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 shadow-sm bg-surface/30 backdrop-blur-md text-white">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Carousel Navigation & Indicators */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="الشريحة السابقة"
                  className="p-1.5 rounded-full bg-surface border border-border/50 text-text-secondary hover:text-text-primary active:scale-90 transition-transform"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5" role="tablist" aria-label="شرائح المسارات">
                  {mobileSlides.map((_, idx) => (
                    <button
                      key={`dot-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={idx === currentSlide}
                      aria-label={`شريحة ${idx + 1}`}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                        ? "w-6 bg-brand-primary"
                        : "w-2 bg-border hover:bg-text-secondary/40"
                        }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="الشريحة التالية"
                  className="p-1.5 rounded-full bg-surface border border-border/50 text-text-secondary hover:text-text-primary active:scale-90 transition-transform"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* DESKTOP VIEW: Left column banner + categories grid */}
      <div className="hidden lg:flex flex-row gap-6 items-stretch">
        {/* Right Column: Big Featured Banner (RTL start) */}
        <div className="w-[28%] flex shrink-0">
          <div className="relative w-full rounded-2xl overflow-hidden border border-border/40 shadow-xl group min-h-full bg-surface">
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
        <div className="w-[72%]">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
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
                        background: category.color,
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
      <div className="mt-8 sm:mt-12 flex justify-center">
        <Link
          href="/categories"
          className="px-8 sm:px-10 py-3 sm:py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
        >
          <span>كل المسارات</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
