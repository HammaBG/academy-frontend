"use client";

import { useEffect, useState } from "react";
import { useArticleStore, Article } from "@/store/article";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft, Clock, Calendar, User, Share2, Link as LinkIcon, Loader2, Newspaper } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";


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


  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0e16] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin" />
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-[#1a0e16] pt-40 px-4 text-center">
        <Newspaper className="w-20 h-20 text-white/5 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-white mb-4">المقال غير موجود</h1>
        <p className="text-zinc-500 mb-10">عذراً، يبدو أن الرابط الذي اتبعته غير صحيح أو تم حذف المقال.</p>
        <Link 
          href="/articles" 
          className="px-8 py-3 bg-[#8b3d6f] text-white rounded-xl font-bold hover:bg-[#7c3663] transition-all"
        >
          العودة للمدونة
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0e16] text-zinc-300 pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {currentArticle.image_url ? (
          <img 
            src={currentArticle.image_url} 
            alt={currentArticle.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2c1a25] to-[#1a0e16]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e16] via-[#1a0e16]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/articles" 
              className="inline-flex items-center gap-2 text-[#fbad26] hover:text-[#ffc04d] transition-colors mb-8 font-bold text-sm bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للمدونة
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-[1.2] text-right">
              {currentArticle.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8b3d6f]" />
                {currentArticle.created_at ? new Date(currentArticle.created_at).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'اليوم'}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8b3d6f]" />
                10 دقائق للقراءة
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8b3d6f]" />
                بواسطة فريق الأكاديمية
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 mt-12">
        {/* Excerpt/Summary Box */}
        {currentArticle.excerpt && (
          <div className="bg-white/5 border-r-4 border-[#8b3d6f] p-8 rounded-l-2xl mb-12 italic text-lg text-white font-medium leading-relaxed">
            "{currentArticle.excerpt}"
          </div>
        )}

        {/* Full Content */}
        <div className="prose prose-invert prose-lg max-w-none text-right font-medium leading-[1.8] text-zinc-300">
           {currentArticle.content.split('\n').map((paragraph, index) => (
             <p key={index} className="mb-6 whitespace-pre-wrap">
               {paragraph}
             </p>
           ))}
        </div>

        {/* Sharing Section */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white uppercase tracking-wider text-xs">Share Article</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8b3d6f] hover:text-white transition-all border border-white/10">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#fbad26] hover:text-[#1a0e16] transition-all border border-white/10">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[11px] font-bold text-zinc-400">آخر تحديث من 5 دقائق</span>
          </div>
        </div>
      </main>

      {/* Suggested Reading - Simplified for now */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
        <div className="flex items-center justify-between mb-10">
           <h2 className="text-2xl font-extrabold text-white">اقرأ أيضاً</h2>
           <Link href="/articles" className="text-sm font-bold text-[#fbad26] hover:underline underline-offset-4">عرض كل المقالات</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
           {/* Placeholder for similar articles */}
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white/5 h-40 rounded-3xl border border-white/10" />
           ))}
        </div>
      </section>
    </div>
  );
}
