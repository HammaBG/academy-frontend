"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCart, Trash2, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCartStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0e16] to-[#2c1a25] text-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/"
            className="group flex items-center gap-2 text-zinc-400 hover:text-[#fbad26] transition-colors text-sm font-bold"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-[#fbad26]" />
            <h1 className="text-3xl md:text-4xl font-extrabold">
              سلة <span className="text-[#fbad26]">التسوق</span>
            </h1>
          </div>
        </div>
        <p className="text-zinc-400 text-right text-sm mt-1">
          {items.length > 0
            ? `لديك ${items.length} ${items.length === 1 ? "كورس" : "كورسات"} في سلتك`
            : "سلتك فارغة"}
        </p>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-white/10" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-300 mb-3">
              سلة التسوق فارغة
            </h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-sm text-center">
              لم تقم بإضافة أي كورسات إلى سلة التسوق بعد. استكشف الكورسات
              المميزة وابدأ رحلتك التعليمية!
            </p>
            <Link
              href="/courses"
              className="px-8 py-3 bg-[#fbad26] text-[#211] rounded-lg font-bold hover:bg-[#ffc04d] transition-colors text-lg shadow-lg"
            >
              استكشف الكورسات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.course.id}
                  className="group flex gap-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-[#8b3d6f]/40 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-28 h-28 md:w-36 md:h-28 rounded-xl overflow-hidden shrink-0">
                    {item.course.thumbnail?.url ? (
                      <img
                        src={item.course.thumbnail.url}
                        alt={item.course.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 text-right">
                    <div>
                      <h3 className="text-lg font-extrabold text-white truncate mb-1">
                        {item.course.name}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2">
                        {item.course.short_description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={() => removeFromCart(item.course.id)}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                        aria-label={`إزالة ${item.course.name} من السلة`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>إزالة</span>
                      </button>
                      <div className="flex items-baseline gap-1">
                        <span className="text-zinc-500 text-xs font-bold">
                          DT
                        </span>
                        <span className="text-2xl font-black text-[#fbad26] tracking-tight">
                          {item.course.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear All */}
              <button
                onClick={clearCart}
                className="w-full py-3 text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors border border-dashed border-white/10 rounded-xl hover:border-red-400/30"
              >
                مسح جميع العناصر
              </button>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-8">
                <h2 className="text-xl font-extrabold mb-6 text-right">
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">عدد الكورسات</span>
                    <span className="font-bold">{items.length}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">المجموع</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-zinc-500 text-xs font-bold">
                        DT
                      </span>
                      <span className="text-3xl font-black text-[#fbad26]">
                        {totalPrice()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#fbad26] to-[#ff6ba6] text-white rounded-xl font-extrabold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#fbad26]/20"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>دفع</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
