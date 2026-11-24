"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { type Article } from "@/store/article";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface LatestArticlesSectionProps {
  articles: Article[];
  isLoading: boolean;
}

interface ArticleCardProps {
  article: Article;
}

const AUTO_PLAY_INTERVAL = 4500;

function ArticleCard({ article }: ArticleCardProps) {
  const categoryColor = article.category_color || article.category?.color || "#F95353";
  const categoryName = article.category_name || article.category?.name || "عام";

  const handleShareFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
  };

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article.title);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const handleShareWhatsapp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article.title);
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    }
  };

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md w-full"
    >
      <div className="relative h-100 w-full overflow-hidden bg-background">
        {/* Article Image */}
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-text-secondary/40" />
          </div>
        )}

        {/* Left Vertical Color Band with Social Share Buttons */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-14 z-20 flex flex-col items-center justify-end pb-4 gap-2.5 shadow-lg"
          style={{ backgroundColor: categoryColor }}
        >
          <button
            onClick={handleShareFacebook}
            className="w-7 h-7 rounded-full border border-white/80 bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="مشاركة على فيسبوك"
          >
            <FaFacebook className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShareTwitter}
            className="w-7 h-7 rounded-full border border-white/80 bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="مشاركة على تويتر"
          >
            <FaTwitter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShareWhatsapp}
            className="w-7 h-7 rounded-full border border-white/80 bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="مشاركة على واتساب"
          >
            <FaWhatsapp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Name Badge */}
        <div
          className="absolute top-4 right-4 h-7 px-3.5 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg backdrop-blur-md"
          style={{ backgroundColor: categoryColor }}
        >
          {categoryName}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1 text-right">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-text-secondary">
          <Clock className="w-3.5 h-3.5 text-brand-primary" />
          <span>
            {article.created_at ? new Date(article.created_at).toLocaleDateString("ar-SA") : "جديد"}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-brand-primary transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>

        <p className="text-text-secondary text-sm line-clamp-3 mb-6 leading-relaxed">
          {article.excerpt || "لا يوجد ملخص متاح لهذا المقال حالياً."}
        </p>

        <div className="mt-auto flex items-center gap-2 text-sm font-extrabold text-brand-primary group-hover:gap-3 transition-all">
          <span>اقرأ المزيد</span>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Mobile-specific compact card component
 * Horizontal layout with thumbnail on the side, compact metadata, and clean typography.
 */
function MobileArticleCard({ article }: ArticleCardProps) {
  const categoryColor = article.category_color || article.category?.color || "#F95353";
  const categoryName = article.category_name || article.category?.name || "عام";

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group relative flex items-stretch gap-3.5 p-3 rounded-2xl bg-surface border border-border/60 hover:border-brand-primary/50 transition-all duration-300 shadow-sm active:scale-[0.99] overflow-hidden"
    >
      {/* Category color accent indicator line on right border */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1.5 rounded-r-2xl"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Image thumbnail */}
      <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-background/80">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-text-secondary/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0 pr-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shrink-0 shadow-xs"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryName}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-text-secondary truncate">
              <Clock className="w-3 h-3 text-brand-primary shrink-0" />
              <span>
                {article.created_at ? new Date(article.created_at).toLocaleDateString("ar-SA") : "جديد"}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
            {article.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-1">
          <p className="text-xs text-text-secondary line-clamp-1 flex-1 pl-2">
            {article.excerpt || "اقرأ التفاصيل الكاملة للمقال..."}
          </p>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary shrink-0">
            <span>قراءة</span>
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function LatestArticlesSection({ articles, isLoading }: LatestArticlesSectionProps) {
  const displayArticles = useMemo(() => (articles || []).slice(0, 6), [articles]);

  // Mobile Carousel grouping: 2 articles per slide
  const mobileSlides = useMemo(() => {
    const slides: Article[][] = [];
    for (let i = 0; i < displayArticles.length; i += 2) {
      slides.push(displayArticles.slice(i, i + 2));
    }
    return slides;
  }, [displayArticles]);

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
    <section
      dir="rtl"
      className="relative w-full border-t border-border/40 bg-background py-14 sm:py-20 text-right overflow-hidden"
    >
      {/* Subtle decorative glow */}
      <div className="pointer-events-none absolute -top-28 -right-28 h-96 w-96 rounded-full bg-brand-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-brand-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Header Block */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3.5 py-1 text-xs font-black text-brand-primary">
              <BookOpen className="h-3.5 w-3.5" />
              <span>المحتوى والمدونة المعرفية</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary sm:text-4xl">
              آخر الأخبار و <span className="text-brand-primary">المقالات</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-text-secondary sm:text-base">
              مقالات علمية وتوعوية متخصصة في علم النفس، العلاقات الأسرية، والتربية الواعية لنرافقك في رحلة بناء أسرة متوازنة.
            </p>
          </div>

          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 self-start font-extrabold text-brand-primary transition-colors hover:text-brand-primary/80 md:self-auto text-sm sm:text-base"
          >
            <span>عرض جميع المقالات</span>
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && articles.length === 0 && (
          <div>
            {/* Mobile skeleton */}
            <div className="block lg:hidden space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-surface/50 rounded-2xl h-28 animate-pulse border border-border/40 w-full"
                />
              ))}
            </div>

            {/* Desktop skeleton */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface/50 rounded-3xl h-[420px] animate-pulse border border-border/40 w-full"
                />
              ))}
            </div>
          </div>
        )}

        {/* Loaded State */}
        {displayArticles.length > 0 && (
          <div>
            {/* MOBILE VIEW: Auto-switch carousel (2 compact cards per slide) with RTL swipe support */}
            <div
              className="block lg:hidden"
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(${currentSlide * 100}%)`,
                  }}
                >
                  {mobileSlides.map((slideArticles, slideIdx) => (
                    <div
                      key={`slide-${slideIdx}`}
                      className="w-full shrink-0 flex flex-col gap-3 px-0.5"
                    >
                      {slideArticles.map((article) => (
                        <MobileArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Mobile Carousel Navigation & Pagination Dots */}
                {totalSlides > 1 && (
                  <div className="flex items-center justify-between mt-5 px-1">
                    <div className="flex items-center gap-1.5">
                      {mobileSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            currentSlide === idx
                              ? "w-6 bg-brand-primary"
                              : "w-2 bg-border/80 hover:bg-text-secondary/40"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        aria-label="الشريحة السابقة"
                        className="p-1.5 rounded-full bg-surface border border-border/60 text-text-secondary hover:text-text-primary active:scale-90 transition-transform shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        aria-label="الشريحة التالية"
                        className="p-1.5 rounded-full bg-surface border border-border/60 text-text-secondary hover:text-text-primary active:scale-90 transition-transform shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DESKTOP VIEW: High-fidelity 3-column ArticleCard grid with full images and share buttons */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8">
              {displayArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {articles.length === 0 && !isLoading && (
          <div className="py-20 text-center bg-surface/50 rounded-3xl border border-dashed border-border/60">
            <Newspaper className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-1">لا توجد مقالات حالياً</h3>
            <p className="text-text-secondary text-sm">عد قريباً لمتابعة أحدث أخبار الأكاديمية</p>
          </div>
        )}

        {/* Bottom CTA Button */}
        {articles.length > 0 && (
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-brand-primary px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-black text-white shadow-lg shadow-brand-primary/10 transition-all hover:scale-105 hover:bg-brand-primary/90"
            >
              <span>استكشف كافة المقالات</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
