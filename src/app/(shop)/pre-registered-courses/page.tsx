"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { usePreRegistrationStore } from "@/store/preRegistration";
import { Clock, Sparkles, BookOpen, ArrowRight, CheckCircle2, BellRing, Phone, Mail, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/ui/Loader";

export default function PreRegisteredCoursesPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { myPreRegistrations, isLoading, fetchMyPreRegistrations } = usePreRegistrationStore();
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return () => {
      unsubFinish();
    };
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isHydrated && token) {
      fetchMyPreRegistrations(token);
    }
  }, [isHydrated, fetchMyPreRegistrations, token, isAuthenticated, router]);

  if (!isHydrated) {
    return <Loader fullscreen size="lg" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background/30 text-text-primary relative overflow-x-hidden pt-24 pb-20 text-right dir-rtl" dir="rtl">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-border/40 mb-12 gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-text-primary">
              دوراتي <span className="text-amber-500">المحجوزة مسبقاً</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-semibold">
              الكورسات قيد الإعداد التي حجزتها مبكراً للحصول على خصم خاص وتنبيه حصري عند إطلاقها.
            </p>
          </div>
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-[2rem] shadow-sm border border-amber-500/20">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* Content Section */}
        {isLoading && myPreRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader size="md" />
            <p className="text-text-secondary font-bold text-sm">جاري تحميل الدورات المحجوزة...</p>
          </div>
        ) : (
          <>
            {myPreRegistrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myPreRegistrations.map((item) => {
                  const courseObj = typeof item.courseId === "object" ? item.courseId : null;
                  const isReady = courseObj?.ready ?? false;
                  const courseUrl = courseObj ? `/courses/${courseObj.url || courseObj.id || courseObj._id}` : "#";
                  const formattedDate = new Date(item.createdAt).toLocaleDateString("ar-TN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border border-border/50 hover:border-amber-500/40 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-background">
                        {courseObj?.thumbnail?.url ? (
                          <img
                            src={courseObj.thumbnail.url}
                            alt={item.courseName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-text-secondary/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badge: Ready vs Coming Soon */}
                        <div className="absolute top-4 right-4 z-10">
                          {isReady ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              أصبحت جاهزة الآن!
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-md flex items-center gap-1.5 animate-pulse">
                              <Sparkles className="w-3.5 h-3.5" />
                              قيد الإعداد (حجز مسبق)
                            </span>
                          )}
                        </div>

                        {/* Registered Date */}
                        <div className="absolute bottom-3 right-4 flex items-center gap-1 text-white/90 text-xs font-medium drop-shadow-md">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>تاريخ الحجز: {formattedDate}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-text-primary group-hover:text-amber-500 transition-colors leading-snug">
                            {item.courseName}
                          </h3>

                          {courseObj?.short_description && (
                            <p className="text-text-secondary text-xs sm:text-sm line-clamp-2 leading-relaxed">
                              {courseObj.short_description}
                            </p>
                          )}

                          {/* Contact Details summary */}
                          <div className="p-3 rounded-2xl bg-surface/80 border border-border/40 text-xs text-text-secondary space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="font-mono dir-ltr">{item.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </div>
                          </div>

                          {/* Price & Discount breakdown */}
                          {courseObj?.price != null && (
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface/90 border border-border/40">
                              <span className="text-xs text-text-secondary font-bold">السعر المتاح لك:</span>
                              <div className="flex items-center gap-2">
                                {(courseObj.preregistration_discount ?? 0) > 0 ? (
                                  <>
                                    <span className="text-xs line-through text-text-secondary/60 font-semibold">
                                      {courseObj.price} د.ت
                                    </span>
                                    <span
                                      className={`text-base font-black ${
                                        isReady ? "text-emerald-500" : "text-amber-500"
                                      }`}
                                    >
                                      {Math.round(courseObj.price * (1 - (courseObj.preregistration_discount ?? 0) / 100))} د.ت
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                                        isReady
                                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                      }`}
                                    >
                                      -{courseObj.preregistration_discount}%
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-black text-text-primary">
                                    {courseObj.price > 0 ? `${courseObj.price} د.ت` : "مجاني"}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status Message */}
                          <div
                            className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                              isReady
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {isReady ? (
                              <>
                                <BellRing className="w-4 h-4 shrink-0" />
                                <span>الدورة انطلقت رسمياً! يمكنك الآن طلبها بالسعر المخفض.</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>ستصلك رسالة فور توفر الدورة لتأكيد طلبك مع الخصم.</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="border-t border-border/40 pt-4 mt-auto">
                          <Link href={courseUrl} className="block w-full">
                            <button
                              type="button"
                              className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                                isReady
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                              }`}
                            >
                              <span>{isReady ? "مشاهدة الدورة وطلبها" : "صفحة الدورة"}</span>
                              <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center bg-surface/50 border border-border/40 rounded-[3rem] shadow-xl max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
                  <Clock className="w-10 h-10" />
                </div>
                <div className="space-y-2 px-6">
                  <h3 className="text-2xl font-black text-text-primary">لا توجد دورات محجوزة مسبقاً</h3>
                  <p className="text-text-secondary text-sm font-semibold max-w-md mx-auto leading-relaxed">
                    عندما تجد كورسات تحمل علامة "قريباً"، يمكنك حجزها مسبقاً بدون دفع للحصول على خصم استثنائي فور إطلاقها.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/courses">
                    <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-amber-600 transition-all cursor-pointer">
                      <span>استكشف الكورسات</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
