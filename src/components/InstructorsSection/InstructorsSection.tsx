"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, User as UserIcon } from "lucide-react";

const staticTeachers = [
  { id: "t1", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/1.jpeg" },
  { id: "t2", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/2.jpeg" },
  { id: "t3", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/3.jpeg" },
  { id: "t4", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/4.jpg" },
  { id: "t5", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/5.JPG" },
  { id: "t6", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/6.jpg" },
  { id: "t7", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/7.jpg" },
  { id: "t8", name: "د. أستاذ الأكاديمية", title: "خبير تربوي وتدريبي", image: "/teachers/8.jpg" },
];

export function InstructorsSection() {
  return (
    <section className="w-full bg-background border-t border-border/40 py-20 relative overflow-hidden text-right" dir="rtl">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
              فريق <span className="text-brand-primary">المعلمين والدكاترة</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl font-medium mt-2">
              تعرف على نخبة المعلمين والخبراء التربويين في أكاديمية أسس والذين يقودون أبنائكم نحو التميز والإبداع.
            </p>
          </div>

          <Link
            href="/instructors"
            className="group flex items-center gap-2 text-brand-primary font-extrabold hover:text-brand-primary/80 transition-colors self-start md:self-auto"
          >
            <span>عرض جميع المعلمين</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Static Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staticTeachers.map((teacher) => (
            <Link
              key={teacher.id}
              href="/instructors"
              className="group flex flex-col bg-surface backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-md select-none"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-background">
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface text-text-secondary">
                    <UserIcon className="w-12 h-12 text-text-secondary/40" />
                  </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Teacher Info Overlay */}
                <div className="absolute bottom-4 right-4 left-4 text-white text-right space-y-1">
                  <h3 className="text-xl font-extrabold leading-tight drop-shadow-md group-hover:text-brand-primary transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-white/80 text-xs font-semibold drop-shadow-sm">
                    {teacher.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Button "See More" / "/instructors" */}
        <div className="mt-12 text-center">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-brand-primary/10 hover:scale-105"
          >
            <span>عرض جميع المعلمين والدكاترة</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
