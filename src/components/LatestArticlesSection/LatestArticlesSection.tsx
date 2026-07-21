"use client";

import Link from "next/link";
import { type Article } from "@/store/article";
import { ArrowLeft, ChevronRight, Clock, Newspaper, Sparkles } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface LatestArticlesSectionProps {
  articles: Article[];
  isLoading: boolean;
}

interface ArticleCardProps {
  article: Article;
}

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
      className="group flex flex-col bg-surface backdrop-blur-md rounded-none overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md"
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
            {article.created_at ? new Date(article.created_at).toLocaleDateString() : "جديد"}
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

export function LatestArticlesSection({ articles, isLoading }: LatestArticlesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border/40 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            آخر الأخبار و <span className="text-brand-primary">المقالات</span>
          </h2>
        </div>
        <Link
          href="/articles"
          className="group flex items-center gap-2 text-brand-primary font-bold hover:text-brand-primary/80 transition-colors"
        >
          <span>عرض جميع المقالات</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {isLoading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface/50 rounded-3xl h-[420px] animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(articles || []).slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {articles.length === 0 && !isLoading && (
        <div className="py-20 text-center bg-surface/50 rounded-3xl border border-dashed border-border/60">
          <Newspaper className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-1">لا توجد مقالات حالياً</h3>
          <p className="text-text-secondary text-sm">عد قريباً لمتابعة أحدث أخبار الأكاديمية</p>
        </div>
      )}
    </section>
  );
}
