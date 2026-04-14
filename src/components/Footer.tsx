"use client";

import Link from "next/link";
import { Send, ArrowRight } from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-[#8b3d6f] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
        {/* Brand & Social */}
        <div className="space-y-8 text-center lg:text-right">
          <div className="bg-white p-4 rounded-2xl w-32 h-32 mx-auto lg:mr-0 flex items-center justify-center">
            <span className="text-4xl font-black text-[#8b3d6f]">BENAA</span>
          </div>
          <div className="flex justify-center lg:justify-end gap-4">
            {[
              { icon: FaFacebook, href: "#" },
              { icon: FaTwitter, href: "#" },
              { icon: FaYoutube, href: "#" },
              { icon: Send, href: "#" }, // Telegram
            ].map((social, i) => (
              <a key={i} href={social.href} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Latest Courses */}
        <div className="text-right space-y-6">
          <h3 className="text-xl font-bold">أحدث الكورسات</h3>
          <ul className="space-y-3 text-zinc-300 font-medium">
            <li><Link href="#" className="hover:text-white transition-colors">الرسم بالورقة والقلم</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">حروف وكلمات</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">الحساب الذهني Mental Math</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">الأنشطة الفنية للصغار</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">ابني يقرأ الإنجليزية بطلاقة!</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">كلمات وحكايات</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="text-right space-y-6">
          <h3 className="text-xl font-bold">الأقسام</h3>
          <ul className="space-y-3 text-zinc-300 font-medium">
            <li><Link href="#" className="hover:text-white transition-colors">مهارات سوق العمل</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">صناع المستقبل</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">مهارات لغوية</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">مهارات حياتية</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">مهارات تربوية</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">مهارات يدوية</Link></li>
          </ul>
        </div>

        {/* About Site */}
        <div className="text-right space-y-6">
          <h3 className="text-xl font-bold">عن الموقع</h3>
          <ul className="space-y-3 text-zinc-300 font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">من نحن</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">اتصل بنا</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">المُعلمون</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">نصائح تربوية</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">سفراء بناء</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#2c1a25] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-sm font-bold">
          <div className="text-zinc-400">
            جميع الحقوق محفوظة ، أكاديمية بناء 2026
          </div>

          <div className="flex gap-6 text-[#ff6ba6]">
            <Link href="#" className="hover:text-white transition-colors">الشروط والاحكام</Link>
            <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
