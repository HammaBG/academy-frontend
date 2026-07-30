"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useArticleStore, type Article } from "@/store/article";
import { Newspaper, ArrowLeft, Clock, Search, Loader2, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

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
      className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md"
    >
      <div className="relative h-60 w-full overflow-hidden bg-background">
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

export default function ArticlesListPage() {
  const { articles, isLoading, getPublicArticles } = useArticleStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPublicArticles();
  }, [getPublicArticles]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = (articles || []).filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-border/40 pt-32 pb-16 bg-surface/30">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff6ba6]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-right">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-6 font-bold text-sm"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 leading-tight">
            مدونة <span className="text-brand-primary">أسس</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl ml-auto font-medium">
            استكشف عالم المعرفة من خلال مقالاتنا المتخصصة في التكنولوجيا والتعليم وتطوير الذات.
          </p>

          {/* Search Bar */}
          <div className="max-w-md ml-auto mt-8 relative" dir="rtl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ابحث عن المقالات..."
              className="w-full bg-surface border border-border/40 rounded-2xl py-3.5 pr-12 pl-4 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/60 transition-all text-right text-sm font-semibold"
            />
            <Search className="w-5 h-5 text-text-secondary/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="py-24 text-center bg-surface/30 rounded-[32px] border border-dashed border-border/60">
                <Newspaper className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-secondary">لا توجد مقالات منشورة تطابق بحثك</h3>
                <p className="text-text-secondary/60 text-sm mt-1 max-w-xs mx-auto">نحن نعمل على كتابة وتجهيز محتوى تعليمي مميز لك، يرجى العودة لاحقاً.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
