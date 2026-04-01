"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
              <div className="flex items-center gap-4 relative">

                {/* Yellow Courses Button */}
                <Link
                  href="/my-courses"
                  className="hidden md:flex text-sm font-bold text-[#8b3d6f] bg-[#fbad26] hover:bg-[#ffbe45] px-6 py-1.5 rounded-[4px] transition-all shadow-sm"
                >
                  كورساتي
                </Link>

                {/* Vertical Separator */}
                <div className="hidden md:block h-6 w-px bg-white/40"></div>

                {/* User Dropdown Trigger */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer bg-[#423c52] hover:bg-[#4b455c] px-3 py-1.5 rounded-md border border-transparent transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Vertical Separator */}
                <div className="hidden md:block h-6 w-px bg-white/40"></div>

                {/* Cart Icon */}
                <Link href="/cart" className="text-white hover:text-gray-200 hidden sm:block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-[3.2rem] left-0 md:right-auto w-56 bg-white border border-gray-100 shadow-xl rounded-b-md z-50 py-2 font-bold transform origin-top transition-all">
                    <div className="px-4 py-3 border-b border-gray-100 text-center">
                      <span className="text-[#423c52] text-[15px]">{user?.first_name || "المستخدم"}</span>
                    </div>

                    <div className="py-2 flex flex-col items-stretch text-sm text-[#8b3d6f]">
                      <Link href="/profile/edit" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        تعديل الحساب
                      </Link>

                      <Link href="/wallet" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        المحفظة
                      </Link>

                      <Link href="/cart" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors md:hidden" onClick={() => setIsProfileDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        عربة التسوق
                      </Link>

                      <Link href="/orders" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        صفحة الطلبات
                      </Link>

                      <Link href="/favorites" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        المفضلة
                      </Link>

                      {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          لوحة تحكم الإدارة
                        </Link>
                      )}

                      {user?.role === 'instructor' && (
                        <Link href="/instructor/dashboard" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-purple-600" onClick={() => setIsProfileDropdownOpen(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          لوحة تحكم المدرب
                        </Link>
                      )}

                      <button onClick={() => { logout(); setIsProfileDropdownOpen(false); }} className="flex w-full items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-[#8b3d6f] font-bold mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
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
