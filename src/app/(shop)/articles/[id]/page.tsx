"use client";

import { useEffect, useState } from "react";
import { useArticleStore } from "@/store/article";
import { ArrowLeft, Clock, Calendar, User, Share2, Loader2, Newspaper } from "lucide-react";
import { ArticleContentRenderer } from "@/components/ArticleContentRenderer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { currentArticle, isLoading, getPublicArticleById, clearCurrentArticle } = useArticleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) {
      getPublicArticleById(id as string);
    }
    return () => clearCurrentArticle();
  }, [id, getPublicArticleById, clearCurrentArticle]);

  const handleShareFacebook = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(currentArticle?.title || "");
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const handleShareWhatsapp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(currentArticle?.title || "");
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-background pt-40 px-4 text-center text-text-primary">
        <Newspaper className="w-20 h-20 text-text-secondary/20 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold mb-4">المقال غير موجود</h1>
        <p className="text-text-secondary mb-10">عذراً، يبدو أن الرابط الذي اتبعته غير صحيح أو تم حذف المقال.</p>
        <Link
          href="/articles"
          className="px-8 py-3 bg-brand-primary text-white rounded-xl font-extrabold hover:bg-brand-primary/95 transition-all shadow-lg shadow-brand-primary/10"
        >
          العودة للمدونة
        </Link>
      </div>
    );
  }

  const categoryColor = currentArticle.category_color || "#F95353";
  const categoryName = currentArticle.category_name || "عام";

  return (
    <div className="min-h-screen bg-background text-text-primary pb-24 text-right" dir="rtl">
      {/* Top Header Section */}
      <header className="pt-10 pb-8 px-4 border-b border-border/20 bg-surface/30">
        <div className="max-w-4xl mx-auto text-right">
          {/* Back Button & Category Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-all duration-300 text-sm font-extrabold bg-surface hover:bg-surface/80 px-4 py-2 rounded-xl border border-border/40 shadow-xs hover:scale-105 active:scale-95"
            >
              <span>العودة للمدونة</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

            <span
              className="px-4 py-1.5 rounded-full text-xs font-black shadow-xs tracking-wide"
              style={{
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
                border: `1px solid ${categoryColor}30`,
              }}
            >
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary leading-[1.3] tracking-tight mb-8">
            {currentArticle.title}
          </h1>

          {/* Author & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/40 text-xs sm:text-sm font-bold text-text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-text-primary font-black text-sm">فريق الأكاديمية</span>
                <span className="text-[11px] text-text-secondary/70">أستاذ خبير</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <span>
                  {currentArticle.created_at
                    ? new Date(currentArticle.created_at).toLocaleDateString("ar-TN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "اليوم"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                <span>10 دقائق للقراءة</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Full Uncropped Featured Image Display */}
        {currentArticle.image_url && (
          <div className="relative w-full rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-surface mb-12 group">
            <div className="relative max-h-[520px] w-full flex items-center justify-center bg-black/5">
              <img
                src={currentArticle.image_url}
                alt={currentArticle.title}
                className="w-full h-auto max-h-[520px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        )}

        {/* Excerpt Callout Box */}
        {currentArticle.excerpt && (
          <div
            className="relative p-8 rounded-2xl mb-12 bg-surface/80 border-r-4 shadow-sm backdrop-blur-sm"
            style={{ borderRightColor: categoryColor }}
          >
            <p className="text-lg md:text-xl font-bold text-text-primary italic leading-relaxed">
              "{currentArticle.excerpt}"
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-surface/30 p-6 md:p-10 rounded-3xl border border-border/30 shadow-xs">
          <ArticleContentRenderer content={currentArticle.content} />
        </div>

        {/* Share & Interaction Footer */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface/50 p-6 rounded-2xl border border-border/30">
          <div className="flex items-center gap-4">
            <span className="font-black text-text-primary text-sm">مشاركة المقال:</span>
            <div className="flex gap-2">
              <button
                onClick={handleShareFacebook}
                className="w-11 h-11 rounded-xl bg-surface hover:bg-[#1877F2] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95"
                aria-label="مشاركة فيسبوك"
              >
                <FaFacebook className="w-5 h-5" />
              </button>
              <button
                onClick={handleShareTwitter}
                className="w-11 h-11 rounded-xl bg-surface hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95"
                aria-label="مشاركة تويتر"
              >
                <FaTwitter className="w-5 h-5" />
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="w-11 h-11 rounded-xl bg-surface hover:bg-[#25D366] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95"
                aria-label="مشاركة واتساب"
              >
                <FaWhatsapp className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-extrabold text-text-secondary bg-surface px-4 py-2 rounded-full border border-border/40">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span>مقال معتمد من أكاديمية أسس</span>
          </div>
        </div>
      </main>
    </div>
  );
}
