"use client";

import Link from "next/link";
import { HeroTextSvg } from "./HeroTextSvg";

interface BlobCardProps {
  number?: string;
  label?: string;
  imageUrl?: string;
  className?: string;
  aspectClass?: string;
}

function BlobCard({ number, label, imageUrl, className = "", aspectClass = "aspect-square" }: BlobCardProps) {
  if (imageUrl) {
    return (
      <div
        className={`relative w-full rounded-[1.5rem] overflow-hidden border border-border/40 shadow-md group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${aspectClass} ${className}`}
      >
        <img
          src={imageUrl}
          alt="Academy visual representation"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[1.5rem] bg-surface border border-border/40 p-4 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 group ${aspectClass} ${className}`}
    >
      <span
        className="text-xl sm:text-2xl font-black bg-gradient-to-br from-brand-primary to-[#ff6ba6] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
      >
        {number}
      </span>
      <span className="text-[10px] sm:text-xs font-bold text-text-secondary mt-1.5 tracking-wide leading-tight px-1">
        {label}
      </span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-20 overflow-hidden text-right" dir="rtl">
      {/* Background ambient glows */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F95353]/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#F95353]/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Symmetric Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 w-full">
        {/* Right Column: Hero call to action */}
        <div className="w-full lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-right">
          <div className="w-full max-w-[500px] mb-8 hover:scale-[1.01] transition-transform duration-500">
            <HeroTextSvg className="w-full h-auto" />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed font-semibold">
            أسس أكاديمي هي منصة تعليمية و توعوية متخصصة في إعداد الأفراد للحياة الأسرية قبل الزواج وبعده، من خلال برامج و دورات رقمية مبنية على أسس علمية في علم النفس، العلاقات، والتربية الواعية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/courses"
              className="px-8 py-3.5 bg-brand-primary text-white rounded-xl font-extrabold hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg shadow-lg shadow-brand-primary/15 text-center"
            >
              استكشف الكورسات
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-surface border border-border rounded-xl font-extrabold text-text-primary hover:bg-surface/80 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg text-center"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </div>

        {/* Left Column: 3 side-by-side vertical scrolling marquees aligned perfectly to the left edge of the grid */}
        <div className="w-full lg:col-span-6 flex justify-center lg:justify-end">
          {/* items-start is critical here to align cards to the top of the container, preventing blank spaces when translated */}
          <div className="relative h-[650px] w-full max-w-[580px] mx-auto overflow-hidden flex gap-4 items-start lg:-mt-20 z-0">
            {/* Top and Bottom Fading Overlays */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

            {/* Column 1: Scrolls UP */}
            <div className="w-1/3 flex flex-col gap-4 animate-marquee-up hover:[animation-play-state:paused]">
              {/* Set 1 */}
              <BlobCard number="+24k" label="مستخدم نشط" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+200k" label="متابع على المنصات" aspectClass="aspect-square" />
              {/* Set 2 */}
              <BlobCard number="+24k" label="مستخدم نشط" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+200k" label="متابع على المنصات" aspectClass="aspect-square" />
              {/* Set 3 */}
              <BlobCard number="+24k" label="مستخدم نشط" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+200k" label="متابع على المنصات" aspectClass="aspect-square" />
            </div>

            {/* Column 2: Scrolls DOWN */}
            <div className="w-1/3 flex flex-col gap-4 animate-marquee-down hover:[animation-play-state:paused]">
              {/* Set 1 */}
              <BlobCard number="+10" label="شركاء الأكاديمية" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+150" label="كادر طبي" aspectClass="aspect-square" />
              {/* Set 2 */}
              <BlobCard number="+10" label="شركاء الأكاديمية" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+150" label="كادر طبي" aspectClass="aspect-square" />
              {/* Set 3 */}
              <BlobCard number="+10" label="شركاء الأكاديمية" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="+150" label="كادر طبي" aspectClass="aspect-square" />
            </div>

            {/* Column 3: Scrolls UP */}
            <div className="w-1/3 flex flex-col gap-4 animate-marquee-up hover:[animation-play-state:paused]">
              {/* Set 1 */}
              <BlobCard number="98%" label="نسبة الرضا" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="4.9★" label="تقييم العملاء" aspectClass="aspect-square" />
              {/* Set 2 */}
              <BlobCard number="98%" label="نسبة الرضا" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="4.9★" label="تقييم العملاء" aspectClass="aspect-square" />
              {/* Set 3 */}
              <BlobCard number="98%" label="نسبة الرضا" aspectClass="aspect-square" />
              <BlobCard imageUrl="/Ossos/ca.jpeg" aspectClass="aspect-square" />
              <BlobCard number="4.9★" label="تقييم العملاء" aspectClass="aspect-square" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
