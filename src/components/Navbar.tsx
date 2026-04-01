"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Exact links from the image
  const links = [
    { name: "الرئيسية", href: "/", active: true },
    { name: "الأقسام", href: "/categories" },
    { name: "الكورسات", href: "/courses" },
    { name: "الباقات", href: "/packages" },
    { name: "عن الأكاديمية", href: "/about" },
    { name: "بناء تيوب", href: "/benaaTube" },
    { name: "سفراء بناء", href: "/affiliate" },
  ];

  return (
    <nav className="w-full bg-[#8b3d6f] relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-stretch h-16">
          
          {/* Right side: Links and Logo */}
          <div className="flex items-stretch gap-8">
            {/* Logo Tab */}
            <div className="flex-shrink-0 flex items-start">
              <Link href="/" className="bg-white rounded-b-2xl shadow-md px-4 pb-3 pt-2 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                {/* Logo Image Placeholder matching the blocky Benaa logo */}
                <div className="grid grid-cols-3 gap-0.5 w-12 h-10 mb-1">
                  <div className="w-full h-full bg-[#fbad26] rounded-sm col-start-1 row-start-2"></div>
                  <div className="w-full h-full bg-[#e84b8d] rounded-sm col-start-2 row-start-1"></div>
                  <div className="w-full h-full bg-[#8b3d6f] rounded-sm col-start-2 row-start-2"></div>
                  <div className="w-full h-full bg-[#3ab795] rounded-sm col-start-3 row-start-2"></div>
                  <div className="w-full h-full bg-[#20a4f3] rounded-sm col-start-3 row-start-3"></div>
                </div>
                <span className="font-extrabold text-[13px] text-[#2c1a4d] tracking-widest leading-none mt-1">
                  BENAA
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-stretch gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center text-[15px] font-bold text-white tracking-wide transition-colors hover:text-gray-200 relative ${link.active ? 'border-b-4 border-[#fbad26] pt-1' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Left side: Auth / Search / Profile buttons */}
          <div className="flex items-center gap-4">
            
            {/* Search Icon */}
            <button className="text-white hover:text-gray-200 p-2 hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Vertical Separator */}
            <div className="hidden sm:block h-6 w-px bg-white/40"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold border border-white/40 group-hover:bg-white/30 transition-all">
                    {user?.first_name ? user.first_name[0] : "م"}
                  </div>
                  <span className="text-sm font-bold text-white hidden lg:block">
                    {user?.first_name || "مرحباً"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-bold text-white px-4 py-1.5 rounded-lg border border-[#fbad26] hover:bg-[#fbad26] hover:text-[#8b3d6f] transition-all"
                >
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-sm font-bold text-white px-6 py-1.5 rounded-[4px] border border-white hover:bg-white/10 transition-all"
                >
                  دخول
                </Link>
                <Link
                  href="/"
                  className="text-sm font-bold text-[#8b3d6f] bg-[#fbad26] hover:bg-[#ffbe45] px-6 py-1.5 rounded-[4px] transition-all shadow-sm"
                >
                  تسجيل
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition-all"
              >
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 bg-[#7c3663]' : 'max-h-0 opacity-0 bg-[#8b3d6f]'}`}>
        <div className="px-4 py-4 space-y-2 border-t border-white/10">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-bold transition-colors ${link.active ? 'text-[#fbad26] bg-white/5' : 'text-white hover:bg-white/10'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-white/10 sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/"
                className="text-center text-sm font-bold text-white border border-white hover:bg-white/10 px-4 py-2.5 rounded-[4px] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                دخول
              </Link>
              <Link
                href="/"
                className="text-center text-sm font-bold text-[#8b3d6f] bg-[#fbad26] hover:bg-[#ffbe45] px-4 py-2.5 rounded-[4px] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تسجيل
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
