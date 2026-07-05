import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "عن الموقع - أكاديمية بناء",
    description: "منصة إلكترونية متخصصة في تنمية مهارات الأطفال، ودعم الأمهات والآباء في تنمية مهاراتهم التربوية مع أبنائهم.",
};

export default function AboutPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-16 font-sans text-right" dir="rtl">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#8b3d6f]/10 via-white to-[#fbad26]/10">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <span className="inline-block bg-[#8b3d6f]/10 text-[#8b3d6f] text-xs font-black px-4 py-1.5 rounded-full mb-4">
                        من نحن
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                        أكاديمية <span className="text-[#8b3d6f]">أسس</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 font-medium leading-relaxed">
                        منصة إلكترونية متخصصة في تنمية مهارات الأطفال، ودعم الأمهات والآباء في تنمية مهاراتهم التربوية مع أبنائهم.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8b3d6f]/5 to-[#fbad26]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
            </section>

            {/* Goals & Values Section */}
            <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                        أهدافنا ورسالتنا
                    </h2>
                    <div className="w-16 h-1 bg-[#fbad26] mx-auto mt-3 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Goal 1 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#8b3d6f]/10 flex items-center justify-center mb-6 text-[#8b3d6f]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            تنمية قدرات الطفل
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            تنمية القدرات العقلية والإبداعية للطفل، وتجهيزه ليكون متعدد المهارات، نابه العقل، وواسع المدارك.
                        </p>
                    </div>

                    {/* Goal 2 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#fbad26]/10 flex items-center justify-center mb-6 text-[#fbad26]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            دعم الأمهات والآباء
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            تنمية مهاراتهم التربوية، لجعلهم أكثر قدرة على تحسين سلوك الأبناء بدون ضغط نفسي وعصبي.
                        </p>
                    </div>

                    {/* Goal 3 */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#8b3d6f]/10 flex items-center justify-center mb-6 text-[#8b3d6f]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            محتوى علمي عالي الجودة
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            توفير محتوى علمي متميز، وبتكلفة بسيطة، لبناء أسرة ناجحة قادرة على مواجهة تحديات ومخاطر العصر.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-600 font-bold text-base md:text-lg">
                    وذلك من خلال مجموعة متنوعة من الدورات التدريبية المكثفة والمتخصصة.
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="bg-[#8b3d6f] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-black mb-4">
                            هل أنت معلم أو مدرب؟
                        </h2>
                        <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed">
                            إذا كنت تمتلك الخبرة والشغف لتعليم الأطفال وتطوير مهاراتهم، انضم إلينا اليوم وساهم في بناء جيل المستقبل.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link
                            href="/signup"
                            className="inline-block bg-[#fbad26] hover:bg-[#ffbe45] text-[#8b3d6f] font-black px-8 py-4 rounded-xl transition-all shadow-md hover:scale-105"
                        >
                            انضم كمدرب الآن
                        </Link>
                    </div>
                    {/* Design Element */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#fbad26]/10 rounded-full blur-2xl pointer-events-none"></div>
                </div>
            </section>
        </div>
    );
}
