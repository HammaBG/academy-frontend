export default function HomePage() {
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
    </div>
  );
}
