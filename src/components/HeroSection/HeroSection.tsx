"use client";

import Link from "next/link";
import { HeroTextSvg } from "./HeroTextSvg";

interface BlobCardProps {
  number?: string;
  label?: string;
  imageUrl?: string;
  className?: string;
}

function BlobCard({ number, label, imageUrl, className = "" }: BlobCardProps) {
  if (imageUrl) {
    return (
      <div
        className={`relative aspect-square w-full rounded-[2rem] overflow-hidden border border-border/40 shadow-lg group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${className}`}
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
      className={`aspect-square w-full rounded-[2rem] bg-surface border border-border/40 p-6 flex flex-col justify-center items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group ${className}`}
    >
      <span
        className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-brand-primary to-[#ff6ba6] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
      >
        {number}
      </span>
      <span className="text-xs sm:text-sm font-bold text-text-secondary mt-2 tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-16 lg:py-28 overflow-hidden">
      {/* Background ambient glows */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#fbad26]/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#ff6ba6]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative flex flex-col lg:flex-row gap-16 items-center justify-between">
        {/* Right Column: Hero call to action */}
        <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-right">
          <div className="w-full max-w-[500px] mb-8 hover:scale-[1.01] transition-transform duration-500">
            <HeroTextSvg className="w-full h-auto" />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed">
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

        {/* Left Column: Asymmetric 6 blobs grid */}
        <div className="w-full lg:w-[50%] flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 w-full max-w-[550px] lg:max-w-none px-4 lg:px-0">
            <BlobCard
              number="+24k"
              label="مستخدم نشط"
              className="sm:-translate-y-4"
            />
            <BlobCard
              number="+10"
              label="شركاء الأكاديمية"
              className="sm:translate-y-4"
            />
            <BlobCard
              imageUrl="/Ossos/blob image1.jpg"
              className="sm:-translate-y-8"
            />
            <BlobCard
              number="+150"
              label="كادر طبي"
              className="sm:translate-y-2"
            />
            <BlobCard
              number="+200k"
              label="متابع على المنصات"
              className="sm:translate-y-12"
            />
            <BlobCard
              imageUrl="/Ossos/blob image 2.jpg"
              className="sm:translate-y-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
