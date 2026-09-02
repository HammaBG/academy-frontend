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
    <div className="min-h-screen bg-background text-text-primary pb-20 text-right" dir="rtl">
      {/* Hero Header Banner */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden border-b border-border/40">
        {currentArticle.image_url ? (
          <img
            src={currentArticle.image_url}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
          <div className="max-w-4xl mx-auto text-right">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-text-primary hover:text-brand-primary transition-colors mb-6 font-bold text-sm bg-surface/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/40 shadow-sm"
            >
              <span>العودة للمدونة</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

            {/* Category Tag */}
            <div className="mb-4">
              <span
                className="px-3.5 py-1 rounded-full text-white text-xs font-extrabold shadow-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryName}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-[1.2]">
              {currentArticle.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-bold text-text-secondary">
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
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                <span>بواسطة فريق الأكاديمية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Area */}
      <main className="max-w-4xl mx-auto px-4 mt-12">
        {/* Excerpt Summary Box */}
        {currentArticle.excerpt && (
          <div
            className="bg-surface/50 p-8 rounded-2xl mb-12 italic text-lg text-text-primary font-medium leading-relaxed border-r-4 shadow-sm"
            style={{ borderRightColor: categoryColor }}
          >
            "{currentArticle.excerpt}"
          </div>
        )}

        {/* Content Area */}
        <ArticleContentRenderer content={currentArticle.content} />

        {/* Sharing & Social Bar */}
        <div className="mt-20 pt-10 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-text-secondary text-xs uppercase tracking-wider">مشاركة المقال:</span>
            <div className="flex gap-2">
              <button
                onClick={handleShareFacebook}
                className="w-10 h-10 rounded-xl bg-surface hover:bg-[#1877F2] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-sm"
                aria-label="مشاركة فيسبوك"
              >
                <FaFacebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareTwitter}
                className="w-10 h-10 rounded-xl bg-surface hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-sm"
                aria-label="مشاركة تويتر"
              >
                <FaTwitter className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="w-10 h-10 rounded-xl bg-surface hover:bg-[#25D366] hover:text-white transition-all duration-300 border border-border/40 flex items-center justify-center shadow-sm"
                aria-label="مشاركة واتساب"
              >
                <FaWhatsapp className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-border/40 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold text-text-secondary">آخر تحديث مؤخراً</span>
          </div>
        </div>
      </main>
    </div>
  );
}
