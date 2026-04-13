"use client";

import { useEffect } from "react";
import { useArticleStore } from "@/store/article";
import { Newspaper, ArrowRight, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { articles, isLoading, getPublicArticles } = useArticleStore();

  useEffect(() => {
    getPublicArticles();
  }, [getPublicArticles]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0e16] to-[#2c1a25] text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          مرحباً بك في أكاديمية
          <span className="bg-gradient-to-r from-[#fbad26] to-[#ff6ba6] bg-clip-text text-transparent"> بناء</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          منصة تعليمية متكاملة تقدم لك أفضل الكورسات، الباقات التعليمية، والبرامج المتخصصة في مختلف المجالات
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/courses"
            className="px-8 py-3 bg-[#fbad26] text-[#211] rounded-lg font-bold hover:bg-[#ffc04d] transition-colors text-lg shadow-lg"
          >
            استكشف الكورسات
          </a>
          <a
            href="/signup"
            className="px-8 py-3 bg-transparent border-2 border-[#fff] rounded-lg font-bold hover:bg-white/10 transition-colors text-lg"
          >
            ابدأ الآن مجاناً
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-[#3ab795] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">كورسات احترافية</h3>
            <p className="text-zinc-400">محتوى تعليمي عالي الجودة يقدمه نخبة من المدربين والخبراء</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-[#20a4f3] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">مجتمع تعليمي</h3>
            <p className="text-zinc-400">تواصل مع زملائك الطلاب وشارك في النقاشات والأنشطة</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-[#e84b8d] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">شهادات معتمدة</h3>
            <p className="text-zinc-400">احصل على شهادات رسمية معترف بها بعد إتمام الكورسات</p>
          </div>
        </div>
      </section>
      
      {/* Latest Articles Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="text-right md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              آخر الأخبار و <span className="text-[#ff6ba6]">المقالات</span>
            </h2>
            <p className="text-zinc-400 max-w-xl font-medium">
              اكتشف أحدث المقالات التعليمية، النصائح، والتريندات في عالم التقنية والتعلم
            </p>
          </div>
          <Link 
            href="/articles" 
            className="group flex items-center gap-2 text-[#fbad26] font-bold hover:text-[#ffc04d] transition-colors"
          >
            <span>عرض جميع المقالات</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-[400px] animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(articles || []).slice(0, 3).map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.id}`}
                className="group flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#8b3d6f]/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8b3d6f]/10"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {article.image_url ? (
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2c1a25] to-[#1a0e16] flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 h-8 px-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Blog Post
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4 text-[11px] font-bold text-zinc-500">
                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'New'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-extrabold mb-3 text-white group-hover:text-[#fbad26] transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                    {article.excerpt || "No summary provided for this article."}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[13px] font-extrabold text-[#ff6ba6] group-hover:gap-3 transition-all">
                    <span>اقرأ المزيد</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {articles.length === 0 && !isLoading && (
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Newspaper className="w-16 h-16 text-white/5 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">لا توجد مقالات حالياً</h3>
            <p className="text-zinc-500 text-sm">عد قريباً لمتابعة أحدث أخبار الأكاديمية</p>
          </div>
        )}
      </section>
    </div>

  );
}
