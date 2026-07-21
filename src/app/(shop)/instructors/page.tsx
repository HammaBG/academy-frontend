"use client";

import Link from "next/link";
import { Sparkles, BookOpen, Award, ArrowLeft } from "lucide-react";

interface Teacher {
    id: number;
    name: string;
    title: string;
    specialty: string;
    image: string;
}

const teachers: Teacher[] = [
    {
        id: 1,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/1.jpeg",
    },
    {
        id: 2,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/2.jpeg",
    },
    {
        id: 3,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/3.jpeg",
    },
    {
        id: 4,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/4.jpg",
    },
    {
        id: 5,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/5.JPG",
    },
    {
        id: 6,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/6.jpg",
    },
    {
        id: 7,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/7.jpg",
    },
    {
        id: 8,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/8.jpg",
    },
    {
        id: 9,
        name: "د. أستاذ الأكاديمية",
        title: "خبير تربوي وتدريبي",
        specialty: "التنمية والتربية الحديثة",
        image: "/teachers/9.png",
    },
];

export default function InstructorsPage() {
    return (
        <div className="min-h-screen bg-background text-text-primary text-right font-sans relative overflow-x-hidden" dir="rtl">
            {/* Hero Header Section */}
            <section className="relative overflow-hidden py-16 bg-surface/10 border-b border-border/40">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-text-primary leading-tight mb-4">
                        فريق <span className="text-brand-primary">المعلمين والدكاترة</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-secondary font-medium leading-relaxed">
                        تعرف على نخبة المعلمين والخبراء التربويين في أكاديمية أسس والذين يقودون أبنائكم نحو التميز والإبداع.
                    </p>
                </div>
            </section>

            {/* Main Instructors Grid */}
            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="group relative flex flex-col bg-surface backdrop-blur-md rounded-[32px] overflow-hidden border border-border/40 hover:border-brand-primary/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-md text-right select-none"
                        >
                            {/* Image Frame */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-background">
                                <img
                                    src={teacher.image}
                                    alt={teacher.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Top Badge */}
                                <div className="absolute top-4 right-4 bg-brand-primary/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>{teacher.specialty}</span>
                                </div>

                                {/* Info Overlay at Bottom of Image */}
                                <div className="absolute bottom-4 right-4 left-4 text-white space-y-1">
                                    <h3 className="text-2xl font-black leading-tight drop-shadow-md">
                                        {teacher.name}
                                    </h3>
                                    <p className="text-white/80 text-xs font-semibold drop-shadow-sm">
                                        {teacher.title}
                                    </p>
                                </div>
                            </div>

                            {/* Action / Bio Footer */}
                            <div className="p-6 flex items-center justify-between bg-surface border-t border-border/40">
                                <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
                                    <BookOpen className="w-4 h-4 text-brand-primary" />
                                    <span>دورات معتمدة</span>
                                </div>

                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white text-xs font-extrabold rounded-xl transition-all duration-300"
                                >
                                    <span>استعرض الدورات</span>
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
