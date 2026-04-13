"use client";

import { useEffect } from "react";
import { useArticleStore } from "@/store/article";
import { Newspaper, ArrowLeft, Clock, Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ArticlesListPage() {
  const { articles, isLoading, getPublicArticles } = useArticleStore();

  useEffect(() => {
    getPublicArticles();
  }, [getPublicArticles]);

  return (
    <div className="min-h-screen bg-[#1a0e16]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2c1a25] to-[#1a0e16] pt-32 pb-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8b3d6f] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbad26] rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight text-center md:text-right">
             مدونة <span className="bg-gradient-to-r from-[#fbad26] to-[#ff6ba6] bg-clip-text text-transparent">بناء الأكاديمية</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto md:mr-0 text-center md:text-right font-medium">
            استكشف عالم المعرفة من خلال مقالاتنا المتخصصة في التكنولوجيا والتعليم وتطوير الذات.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {isLoading && articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
            <p className="text-[#8b3d6f] font-bold animate-pulse">جاري تحميل المعرفة...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(articles || []).map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.id}`}
                  className="group flex flex-col bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-[#8b3d6f]/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8b3d6f]/10"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2c1a25] to-[#1a0e16] flex items-center justify-center">
                        <Newspaper className="w-16 h-16 text-white/10" />
                      </div>
                    )}
                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-extrabold text-white uppercase tracking-widest">
                      Resource
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-5 text-[12px] font-bold text-zinc-500">
                      <div className="flex items-center gap-2 uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-[#fbad26]" />
                        {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold mb-4 text-white group-hover:text-[#fbad26] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-base line-clamp-3 mb-8 font-medium leading-relaxed">
                      {article.excerpt || "اقرأ المزيد حول هذا الموضوع في مقالنا الحصري على أكاديمية بناء."}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-sm font-extrabold text-[#ff6ba6] uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                         Read Article
                       </span>
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#8b3d6f] group-hover:border-[#8b3d6f] transition-all">
                          <ArrowLeft className="w-4 h-4 text-white -rotate-180" />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {articles.length === 0 && !isLoading && (
              <div className="py-40 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <Newspaper className="w-24 h-24 text-white/5 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-zinc-400">لا توجد مقالات منشورة حالياً</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mt-2">نحن نعمل على تجهيز محتوى تعليمي مميز لك، يرجى العودة لاحقاً.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
