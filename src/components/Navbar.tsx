"use client";

import { useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, type User } from "@/store/auth";
import { useCartStore, type CartItem as ICartItem } from "@/store/cart";
import { useCourseStore, type Course } from "@/store/course";
import { useTheme } from "@/components/providers/ThemeProvider";
import logo from "../../public/ossosacademy.jpg";
import { Search, X, BookOpen, User as UserIcon, Sun, Moon } from "lucide-react";

interface SearchCourseResultProps {
  course: Course;
  onClick: () => void;
}

function SearchCourseResult({ course, onClick }: SearchCourseResultProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      onClick={onClick}
      className="flex items-center gap-4 p-3 hover:bg-surface rounded-xl transition-all border border-transparent hover:border-border"
    >
      <div className="w-[90px] h-[60px] rounded-lg overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center">
        {course.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-6 h-6 text-text-secondary/40" />
        )}
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-text-primary text-base font-bold truncate">{course.name}</p>
        <p className="text-text-secondary text-sm truncate">{course.short_description}</p>
      </div>
    </Link>
  );
}

interface SearchInstructorResultProps {
  instructor: User;
  onClick: () => void;
}

function SearchInstructorResult({ instructor, onClick }: SearchInstructorResultProps) {
  return (
    <Link
      href={`#`}
      onClick={onClick}
      className="flex items-center gap-4 p-3 hover:bg-surface rounded-xl transition-all border border-transparent hover:border-border"
    >
      <div className="w-[90px] h-[60px] rounded-lg overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center">
        {instructor.avatar_url ? (
          <img src={instructor.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-text-secondary/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-text-primary text-base font-bold truncate">
          {instructor.first_name} {instructor.last_name}
        </p>
        <p className="text-text-secondary text-sm truncate">{instructor.email}</p>
      </div>
    </Link>
  );
}

interface CartItemProps {
  item: ICartItem;
  onRemove: (id: string) => void;
}

function CartItem({ item, onRemove }: CartItemProps) {
  const handleRemove = () => {
    onRemove(item.course.id);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-background/50 transition-colors">
      <button
        onClick={handleRemove}
        className="text-text-secondary hover:text-brand-primary transition-colors shrink-0"
        aria-label={`إزالة ${item.course.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-text-primary text-sm truncate">{item.course.name}</p>
        <p className="text-brand-primary text-xs mt-0.5">{item.course.price} TND</p>
      </div>
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
        {item.course.thumbnail?.url ? (
          <img src={item.course.thumbnail.url} alt={item.course.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>
    </div>
  );
}

interface SearchResults {
  courses: Course[];
  instructors: User[];
}

export function Navbar() {
  const { user, isAuthenticated, logout, instructors, getInstructors } = useAuthStore();
  const { items, removeFromCart, itemCount } = useCartStore();
  const { courses, getPublicCourses } = useCourseStore();
  const { theme, setTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({ courses: [], instructors: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(target)) {
        setIsCartDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && courses.length === 0) {
      getPublicCourses();
    }
    if (isSearchOpen && instructors.length === 0) {
      getInstructors();
    }
  }, [isSearchOpen, courses.length, instructors.length, getPublicCourses, getInstructors]);

  const displayCourses = searchQuery.trim().length >= 2 ? searchResults.courses : courses.slice(0, 5);
  const displayInstructors = searchQuery.trim().length >= 2 ? searchResults.instructors : instructors.slice(0, 5);

  const pathname = usePathname();

  const links = useMemo(
    () => [
      { name: "الرئيسية", href: "/", active: pathname === "/" },
      { name: "المسارات", href: "/categories", active: pathname === "/categories" || pathname.startsWith("/categories/") },
      { name: "الكورسات", href: "/courses", active: pathname === "/courses" || pathname.startsWith("/courses/") },
      { name: "الباقات", href: "/packages", active: pathname === "/packages" || pathname.startsWith("/packages/") },
      { name: "عن الأكاديمية", href: "/about", active: pathname === "/about" },
      { name: "عن المُعلمون", href: "/instructors", active: pathname === "/instructors" || pathname.startsWith("/instructors/") }
    ],
    [pathname]
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults({ courses: [], instructors: [] });
      return;
    }

    setIsSearching(true);
    try {
      const [coursesRes, instructorsRes] = await Promise.all([
        fetch("https://academy-backend-8gl3.onrender.com/api/courses/get-courses"),
        fetch("https://academy-backend-8gl3.onrender.com/api/auth/instructors"),
      ]);

      const coursesData = coursesRes.ok ? await coursesRes.json() : { courses: [] };
      const instructorsData = instructorsRes.ok ? await instructorsRes.json() : { instructors: [] };

      const allCourses: Course[] = coursesData.courses || [];
      const allInstructors: User[] = instructorsData.instructors || [];

      const q = query.toLowerCase();
      const matchedCourses = allCourses.filter(
        (c) => c.name.toLowerCase().includes(q) || c.short_description?.toLowerCase().includes(q)
      );

      const matchedInstructors = allInstructors.filter((inst) => {
        const fullName = `${inst.first_name || ""} ${inst.last_name || ""}`.toLowerCase();
        return fullName.includes(q) || inst.email?.toLowerCase().includes(q);
      });

      setSearchResults({
        courses: matchedCourses.slice(0, 5),
        instructors: matchedInstructors.slice(0, 5),
      });
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleToggleProfile = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    setIsCartDropdownOpen(false);
  };

  const handleCloseProfile = () => {
    setIsProfileDropdownOpen(false);
  };

  const handleToggleCart = () => {
    setIsCartDropdownOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
  };

  const handleCloseCart = () => {
    setIsCartDropdownOpen(false);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-stretch h-16">
          {/* Right side: Logo and Links */}
          <div className="flex items-stretch gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-surface shadow-sm flex items-center justify-center">
                  <img src={logo.src} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold text-base text-text-primary tracking-wide transition-colors group-hover:text-brand-primary">
                  أكاديمية أسس
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-stretch gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center text-[15px] font-semibold tracking-wide transition-all duration-300 relative py-2 ${link.active
                    ? "text-brand-primary font-bold"
                    : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {link.name}
                  {link.active && (
                    <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-brand-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Left side: Auth, Search, Theme Switcher */}
          <div className="flex items-center gap-4">
            {/* Search Toggle */}
            <div ref={searchRef} className="relative hidden sm:block">
              <button
                onClick={handleOpenSearch}
                className="text-text-secondary hover:text-text-primary hover:bg-surface/80 p-2 rounded-full transition-all"
                aria-label="بحث"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Fullscreen Search Overlay */}
              {isSearchOpen && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-[999] overflow-y-auto" dir="rtl">
                  <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
                    {/* Search Input Block */}
                    <div className="relative mb-8">
                      <div className="relative">
                        <input
                          autoFocus
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          placeholder="ابحث عن كورسات أو معلمين..."
                          className="w-full bg-transparent border-0 border-b border-text-primary/40 text-text-primary text-3xl md:text-4xl font-bold placeholder-text-secondary/60 outline-none py-6 pr-2"
                        />
                        <button
                          onClick={handleCloseSearch}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-text-primary/10 hover:bg-text-primary/20 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="h-6 w-6 text-text-primary" />
                        </button>
                      </div>
                    </div>

                    {/* Search Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {isSearching ? (
                        <div className="md:col-span-2 text-center text-text-secondary py-12 text-lg">
                          جاري البحث...
                        </div>
                      ) : (
                        <>
                          {/* Courses Results */}
                          <div>
                            <h3 className="text-text-primary text-xl font-bold mb-4 pb-3 border-b border-text-primary/20">
                              الكورسات
                            </h3>
                            <div className="space-y-1">
                              {displayCourses.length > 0 ? (
                                displayCourses.map((course) => (
                                  <SearchCourseResult
                                    key={course.id}
                                    course={course}
                                    onClick={handleCloseSearch}
                                  />
                                ))
                              ) : (
                                <p className="text-text-secondary/60 text-sm py-4">لا توجد كورسات</p>
                              )}
                            </div>
                          </div>

                          {/* Instructors Results */}
                          <div>
                            <h3 className="text-text-primary text-xl font-bold mb-4 pb-3 border-b border-text-primary/20">
                              المُعلمون
                            </h3>
                            <div className="space-y-1">
                              {displayInstructors.length > 0 ? (
                                displayInstructors.map((instructor) => (
                                  <SearchInstructorResult
                                    key={instructor.id}
                                    instructor={instructor}
                                    onClick={handleCloseSearch}
                                  />
                                ))
                              ) : (
                                <p className="text-text-secondary/60 text-sm py-4">لا يوجد معلمون</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="hidden sm:block h-6 w-px bg-border"></div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-text-secondary hover:text-text-primary hover:bg-surface/80 p-2 rounded-full transition-all duration-300 flex items-center justify-center"
              aria-label="تبديل المظهر"
            >
              {!mounted ? (
                <div className="w-5 h-5" />
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400/20 transition-all duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-text-primary fill-text-primary/10 transition-all duration-300" />
              )}
            </button>

            {/* Separator */}
            <div className="hidden sm:block h-6 w-px bg-border"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 relative">
                {/* Courses Button */}
                <Link
                  href="/my-courses"
                  className="hidden md:flex text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/90 px-6 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-brand-primary/20"
                >
                  كورساتي
                </Link>

                {/* Separator */}
                <div className="hidden md:block h-6 w-px bg-border"></div>

                {/* Profile Trigger */}
                <button
                  onClick={handleToggleProfile}
                  className="flex items-center gap-2 cursor-pointer bg-surface hover:bg-surface/80 text-text-primary border border-border px-3 py-1.5 rounded-lg transition-all duration-300"
                >
                  <UserIcon className="h-5 w-5 text-text-secondary" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-text-secondary transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Separator */}
                <div className="hidden md:block h-6 w-px bg-border"></div>

                {/* Cart Toggle */}
                <div ref={cartDropdownRef} className="relative hidden sm:block">
                  <button
                    onClick={handleToggleCart}
                    className="relative text-text-secondary hover:text-text-primary hover:bg-surface/80 p-2 rounded-full transition-all duration-300 flex items-center justify-center"
                    aria-label="سلة التسوق"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {itemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-brand-primary text-white text-[9px] font-bold rounded-full shadow-sm">
                        {itemCount()}
                      </span>
                    )}
                  </button>

                  {/* Cart Dropdown Menu */}
                  {isCartDropdownOpen && (
                    <div className="absolute top-[3rem] left-0 w-80 bg-surface border border-border shadow-2xl rounded-xl z-50 overflow-hidden font-bold transform origin-top transition-all duration-300">
                      {items.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-text-secondary/40 mx-auto mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <p className="text-text-secondary text-sm">سلة التسوق فارغة</p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                            {items.slice(0, 4).map((item) => (
                              <CartItem key={item.course.id} item={item} onRemove={removeFromCart} />
                            ))}
                          </div>
                          {items.length > 4 && (
                            <p className="text-center text-text-secondary/60 text-xs py-2 border-t border-border/40">
                              +{items.length - 4} عناصر أخرى
                            </p>
                          )}
                        </>
                      )}

                      {/* Go to cart */}
                      <Link
                        href="/cart"
                        onClick={handleCloseCart}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white text-sm font-extrabold hover:bg-brand-primary/95 transition-colors"
                      >
                        <span>مشاهدة سلة التسوق</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-[3.2rem] left-0 w-56 bg-surface border border-border shadow-xl rounded-xl z-50 py-2 font-bold transform origin-top transition-all duration-300 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/60 text-center">
                      <span className="text-text-primary text-[15px]">{user?.first_name || "المستخدم"}</span>
                    </div>

                    <div className="py-2 flex flex-col items-stretch text-sm text-text-secondary">
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-3 px-5 py-2.5 text-text-primary hover:bg-background/60 hover:text-brand-primary transition-colors"
                        onClick={handleCloseProfile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        تعديل الحساب
                      </Link>

                      <Link
                        href="/wallet"
                        className="flex items-center gap-3 px-5 py-2.5 text-text-primary hover:bg-background/60 hover:text-brand-primary transition-colors"
                        onClick={handleCloseProfile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        المحفظة
                      </Link>

                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-5 py-2.5 text-text-primary hover:bg-background/60 hover:text-brand-primary transition-colors md:hidden"
                        onClick={handleCloseProfile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        عربة التسوق
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-5 py-2.5 text-text-primary hover:bg-background/60 hover:text-brand-primary transition-colors"
                        onClick={handleCloseProfile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        صفحة الطلبات
                      </Link>

                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-5 py-2.5 text-text-primary hover:bg-background/60 hover:text-brand-primary transition-colors"
                        onClick={handleCloseProfile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        المفضلة
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-5 py-2.5 text-blue-600 hover:bg-background/60 transition-colors"
                          onClick={handleCloseProfile}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          لوحة تحكم الإدارة
                        </Link>
                      )}

                      {user?.role === "instructor" && (
                        <Link
                          href="/instructor/dashboard"
                          className="flex items-center gap-3 px-5 py-2.5 text-purple-600 hover:bg-background/60 transition-colors"
                          onClick={handleCloseProfile}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          لوحة تحكم المدرب
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-5 py-2.5 hover:bg-background/60 text-brand-primary font-bold mt-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
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
                  href="/login"
                  className="text-sm font-semibold text-text-primary px-5 py-2 rounded-lg border border-border hover:bg-surface transition-all duration-300"
                >
                  دخول
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/90 px-5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-brand-primary/20 hover:-translate-y-0.5"
                >
                  تسجيل
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden ml-2">
              <button
                onClick={handleToggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface/80 focus:outline-none transition-all"
              >
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? "hidden" : "block"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? "block" : "hidden"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100 bg-surface border-b border-border" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-4 space-y-2 border-t border-border/40">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${link.active
                ? "text-brand-primary bg-brand-primary/5 font-bold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
              onClick={handleCloseMobileMenu}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-border sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="text-center text-sm font-semibold text-text-primary border border-border hover:bg-surface px-4 py-2.5 rounded-lg transition-colors"
                onClick={handleCloseMobileMenu}
              >
                دخول
              </Link>
              <Link
                href="/signup"
                className="text-center text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/95 px-4 py-2.5 rounded-lg transition-colors"
                onClick={handleCloseMobileMenu}
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

export default Navbar;
