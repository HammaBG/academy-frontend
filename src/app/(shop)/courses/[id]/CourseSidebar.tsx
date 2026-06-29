"use client";

import { Course } from "@/store/course";
import {
  ShoppingBag,
  Zap,
  Infinity as InfinityIcon,
  Monitor,
  Trophy,
  Share2,
  Heart,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const discount = course.estimated_price
    ? Math.round(((course.estimated_price - course.price) / course.estimated_price) * 100)
    : 0;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-3xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500" dir="rtl">
      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-[#fbad26]">{course.price} د.ت</span>
          {course.estimated_price && (
            <span className="text-xl text-zinc-500 line-through font-bold">{course.estimated_price} د.ت</span>
          )}
          {discount > 0 && (
            <span className="bg-[#ff6ba6] text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
              خصم {discount}%
            </span>
          )}
        </div>
        <p className="text-[#3ab795] text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-3 h-3 fill-current" />
          عرض سريع ينتهي قريباً
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <Button className="w-full h-14 bg-[#fbad26] hover:bg-[#ffc04d] text-[#211] font-black text-lg rounded-2xl shadow-lg shadow-[#fbad26]/10 flex gap-3">
          <ShoppingBag className="w-5 h-5" />
          أضف إلى السلة
        </Button>
        <Button variant="outline" className="w-full h-14 border-2 border-white/20 hover:bg-white/5 text-black font-black text-lg rounded-2xl">
          اشتر الآن
        </Button>
      </div>

      <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
        ضمان استرداد الأموال لمدة 30 يوماً
      </p>

      {/* Highlights */}
      <div className="space-y-6 pt-4 border-t border-white/5">
        <h4 className="text-sm font-black text-white uppercase tracking-widest">تشمل هذه الدورة:</h4>
        <div className="space-y-4">
          {[
            { icon: InfinityIcon, text: "وصول مدى الحياة", color: "text-purple-400" },
            { icon: Monitor, text: "وصول على الهواتف والتلفاز", color: "text-blue-400" },
            { icon: Trophy, text: "شهادة إتمام", color: "text-green-400" },
            { icon: BookOpen, text: `${course.course_data?.length || 0} موارد قابلة للتحميل`, color: "text-orange-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share/Wishlist */}
      <div className="flex gap-4">
        <Button variant="ghost" className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold gap-2">
          <Share2 className="w-4 h-4" /> مشاركة
        </Button>
        <Button variant="ghost" className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold gap-2">
          <Heart className="w-4 h-4" /> المفضلة
        </Button>
      </div>
    </div>
  );
}