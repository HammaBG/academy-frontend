"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Mail, MapPin, Phone, ChevronLeft, ExternalLink } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: "https://www.facebook.com/OSSOS.Academy", label: "فيسبوك", color: "hover:text-[#1877F2] hover:border-[#1877F2]/40" },
  { icon: FaInstagram, href: "https://www.instagram.com/ossosacademy", label: "إنستغرام", color: "hover:text-[#E4405F] hover:border-[#E4405F]/40" },
  { icon: FaYoutube, href: "#", label: "يوتيوب", color: "hover:text-[#FF0000] hover:border-[#FF0000]/40" },
  { icon: FaTwitter, href: "#", label: "تويتر", color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/40" },
];

const QUICK_LINKS = [
  { name: "الرئيسية", href: "/" },
  { name: "من نحن", href: "/about" },
  { name: "المسارات التعليمية", href: "/categories" },
  { name: "المصادر والمقالات", href: "/articles" },
  { name: "المُعلمون والخبراء", href: "/instructors" },
  { name: "تواصل معنا", href: "/contact" },
];

const TRACK_LINKS = [
  { name: "مهارات سوق العمل", href: "/courses?category=مهارات%20سوق%20العمل" },
  { name: "صناع المستقبل", href: "/courses?category=صناع%20المستقبل" },
  { name: "مهارات لغوية", href: "/courses?category=مهارات%20لغوية" },
  { name: "مهارات حياتية", href: "/courses?category=مهارات%20حياتية" },
  { name: "مهارات تربوية", href: "/courses?category=مهارات%20تربوية" },
  { name: "مهارات يدوية", href: "/courses?category=مهارات%20يدوية" },
];

export function Footer() {
  return (
    <footer className="bg-surface text-text-primary border-t border-border/30 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/60 to-transparent" />

      {/* Newsletter / CTA Section */}
      <div className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold text-text-primary mb-1">
                انضم إلى مجتمع أكاديمية أسس
              </h3>
              <p className="text-text-secondary text-sm">
                تابعنا على وسائل التواصل الاجتماعي لتصلك آخر الدورات والمقالات
              </p>
            </div>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`w-11 h-11 rounded-xl bg-background border border-border/40 flex items-center justify-center text-text-secondary ${social.color} hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <social.icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300 origin-right">
                {/* Profile Image */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-brand-primary/20 ring-2 ring-border/40">
                  <img
                    src="/Ossos/OSSOS-ACADEMY-profile.png"
                    alt="أكاديمية أسس"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-text-primary leading-tight">
                    أكاديمية <span className="text-brand-primary">أسس</span>
                  </span>
                  <span className="text-xs text-text-secondary/70 tracking-wider uppercase">
                    OSSOS Academy
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-text-secondary text-sm max-w-[380px] leading-relaxed">
              منصتكم التعليمية المتميزة لتطوير المهارات وبناء المستقبل بأعلى معايير الجودة والاحترافية. نؤمن بقوة التعلم المستمر.
            </p>
          </div>
          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group text-text-secondary text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-3 h-3 opacity-0 -mr-2 group-hover:opacity-100 group-hover:mr-0 transition-all duration-200 text-brand-primary" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tracks (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              المسارات التعليمية
            </h4>
            <ul className="space-y-3">
              {TRACK_LINKS.map((track) => (
                <li key={track.name}>
                  <Link
                    href={track.href}
                    className="group text-text-secondary text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-3 h-3 opacity-0 -mr-2 group-hover:opacity-100 group-hover:mr-0 transition-all duration-200 text-brand-primary" />
                    <span>{track.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              اتصل بنا
            </h4>
            <div className="space-y-4">
              <a
                href="https://www.google.com/maps/place/Cyber+Parc/@35.8466443,10.5902907,14.13z/data=!4m6!3m5!1s0x12fd8a42f3d81941:0x91566e7064e70917!8m2!3d35.8506281!4d10.59543!16s%2Fg%2F1vj6nvxq?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 text-text-secondary hover:text-brand-primary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <span className="text-sm block">سوسة، تونس</span>
                  <span className="text-xs text-text-secondary/60 group-hover:text-brand-primary/70 transition-colors">عرض على الخريطة</span>
                </div>
              </a>

              <a
                href="mailto:contact@ossos-academy.com"
                className="group flex items-center gap-3 text-text-secondary hover:text-brand-primary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-sm">contact@ossos-academy.com</span>
              </a>

              <a
                href="tel:+21670000000"
                className="group flex items-center gap-3 text-text-secondary hover:text-brand-primary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-sm dir-ltr inline-block">50120566 +216</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-background/50 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-text-secondary/70 font-medium">
              جميع الحقوق محفوظة ، أكاديمية أسس © {new Date().getFullYear()}
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-xs text-text-secondary/70 hover:text-brand-primary transition-colors font-medium"
              >
                الشروط والأحكام
              </Link>
              <span className="w-px h-3 bg-border/40" />
              <Link
                href="/privacy"
                className="text-xs text-text-secondary/70 hover:text-brand-primary transition-colors font-medium"
              >
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}