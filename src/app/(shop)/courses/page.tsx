"use client";

import { useEffect, Suspense, useState, useMemo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useCourseStore } from "@/store/course";
import type { Course } from "@/store/course";
import { useCategoryStore } from "@/store/category";
import {
  BookOpen,
  Loader2,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
  Clock,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/Course/CourseCard";

type SortOption = "order" | "newest" | "price-asc" | "price-desc" | "rating";
type AvailabilityFilter = "all" | "ready" | "coming_soon";
type LevelFilter = "all" | "Beginner" | "Intermediate" | "Professional";
type PriceFilter = "all" | "free" | "under100" | "100to250" | "above250";

const SORT_LABELS: Record<SortOption, string> = {
  order: "الترتيب الافتراضي (الموصى به)",
  newest: "الأحدث إضافة",
  "price-asc": "السعر: من الأقل للأعلى",
  "price-desc": "السعر: من الأعلى للأقل",
  rating: "الأعلى تقييماً",
};

const LEVEL_LABELS: Record<LevelFilter, string> = {
  all: "جميع المستويات",
  Beginner: "مبتدئ (Beginner)",
  Intermediate: "متوسط (Intermediate)",
  Professional: "احترافي (Professional)",
};

const AVAILABILITY_LABELS: Record<AvailabilityFilter, string> = {
  all: "جميع الدورات",
  ready: "متاحة فوراً (جاهزة للبدء)",
  coming_soon: "قريباً (حجز مسبق بخصم)",
};

const PRICE_LABELS: Record<PriceFilter, string> = {
  all: "جميع الأسعار",
  free: "مجانية (0 د.ت)",
  under100: "أقل من 100 د.ت",
  "100to250": "100 - 250 د.ت",
  above250: "أكثر من 250 د.ت",
};

function CoursesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category");

  const { courses, isLoading: isCoursesLoading, getPublicCourses } = useCourseStore();
  const { categories, getPublicCategories } = useCategoryStore();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory ?? "all");
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityFilter>("all");
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("order");
  const [mobileFilterModalOpen, setMobileFilterModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync category state when URL changes
  useEffect(() => {
    setSelectedCategory(urlCategory ?? "all");
  }, [urlCategory]);

  useEffect(() => {
    getPublicCourses();
    getPublicCategories();
  }, [getPublicCourses, getPublicCategories]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategorySelect = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === "all") {
      router.push("/courses", { scroll: false });
    } else {
      router.push(`/courses?category=${encodeURIComponent(categoryName)}`, { scroll: false });
    }
  }, [router]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAvailability("all");
    setSelectedLevel("all");
    setSelectedPrice("all");
    setSortBy("order");
    router.push("/courses", { scroll: false });
  }, [router]);

  // Check how many filters are currently active beyond defaults
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count += 1;
    if (selectedAvailability !== "all") count += 1;
    if (selectedLevel !== "all") count += 1;
    if (selectedPrice !== "all") count += 1;
    if (searchQuery.trim().length > 0) count += 1;
    if (sortBy !== "order") count += 1;
    return count;
  }, [selectedCategory, selectedAvailability, selectedLevel, selectedPrice, searchQuery, sortBy]);

  // Available unique categories combined from Category store and courses with their colors
  const allCategories = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();

    const palette = [
      "#8b3d6f", // Brand Plum
      "#2563eb", // Royal Blue
      "#059669", // Emerald
      "#d97706", // Amber
      "#7c3aed", // Violet
      "#db2777", // Rose
      "#0891b2", // Cyan
      "#ea580c", // Orange
    ];

    let colorIdx = 0;

    categories.forEach((cat) => {
      const name = cat.name?.trim();
      if (name && !map.has(name)) {
        map.set(name, {
          name,
          color: cat.color?.trim() || palette[colorIdx % palette.length],
        });
        colorIdx++;
      }
    });

    courses.forEach((c) => {
      const name = c.categories?.trim();
      if (name && !map.has(name)) {
        map.set(name, {
          name,
          color: c.category_color?.trim() || palette[colorIdx % palette.length],
        });
        colorIdx++;
      }
    });

    return Array.from(map.values());
  }, [categories, courses]);

  // Current active category object
  const currentCategoryObj = useMemo(() => {
    if (selectedCategory === "all") return null;
    return allCategories.find((c) => c.name === selectedCategory) || null;
  }, [selectedCategory, allCategories]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    const list = (courses || []).filter((course: Course) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = course.name.toLowerCase().includes(query);
        const matchesDesc = (course.short_description || "").toLowerCase().includes(query);
        const matchesTags = (course.tags || "").toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // 2. Category
      if (selectedCategory !== "all") {
        if ((course.categories || "").trim() !== selectedCategory.trim()) {
          return false;
        }
      }

      // 3. Availability
      if (selectedAvailability === "ready" && !course.ready) {
        return false;
      }
      if (selectedAvailability === "coming_soon" && course.ready) {
        return false;
      }

      // 4. Level
      if (selectedLevel !== "all") {
        if ((course.level || "").toLowerCase() !== selectedLevel.toLowerCase()) {
          return false;
        }
      }

      // 5. Price
      const price = Number(course.price ?? 0);
      if (selectedPrice === "free" && price > 0) return false;
      if (selectedPrice === "under100" && price >= 100) return false;
      if (selectedPrice === "100to250" && (price < 100 || price > 250)) return false;
      if (selectedPrice === "above250" && price <= 250) return false;

      return true;
    });

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "order") {
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      }
      if (sortBy === "newest") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "price-asc") {
        return (a.price ?? 0) - (b.price ?? 0);
      }
      if (sortBy === "price-desc") {
        return (b.price ?? 0) - (a.price ?? 0);
      }
      if (sortBy === "rating") {
        return (b.ratings ?? 0) - (a.ratings ?? 0);
      }
      return 0;
    });
  }, [courses, searchQuery, selectedCategory, selectedAvailability, selectedLevel, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen bg-background text-text-primary text-right" dir="rtl">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20">

        {/* Compact Hero Header (Optimized for Mobile) */}
        <div className="text-center mb-6 sm:mb-10 space-y-2 sm:space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[11px] sm:text-xs font-black">
            <Sparkles className="w-3 h-3" />
            <span>كتالوج الدورات المعتمدة والبرامج الأسرية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary leading-tight tracking-tight">
            استكشف <span className="text-brand-primary">دوراتنا</span> المميزة
          </h1>

          <p className="text-text-secondary max-w-2xl mx-auto font-medium text-xs sm:text-sm md:text-base leading-relaxed hidden sm:block">
            برامج ودورات رقمية مبنية على أسس علمية في علم النفس والعلاقات والتربية الواعية، لمساعدتك على بناء حياة أسرية أكثر وعياً واستقراراً.
          </p>

          {/* Search Bar & Quick Mobile Filter Trigger */}
          <div className="max-w-2xl mx-auto mt-4 sm:mt-6 flex items-center gap-2">
            <div className="relative flex-1 shadow-sm rounded-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="ابحث باسم الدورة أو الموضوع..."
                className="w-full bg-surface border border-border/50 rounded-2xl py-3 sm:py-3.5 pr-11 pl-10 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all text-right text-xs sm:text-sm font-semibold shadow-inner"
              />
              <Search className="w-4 h-4 text-text-secondary/50 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-secondary/60 hover:text-text-primary hover:bg-surface/80 transition-colors"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button (Quick Bottom Sheet Trigger) */}
            <button
              type="button"
              onClick={() => setMobileFilterModalOpen(true)}
              className="md:hidden flex items-center justify-center gap-1.5 h-11 px-3.5 rounded-2xl bg-surface border border-border/50 text-text-primary font-black text-xs shrink-0 shadow-sm relative active:scale-95 transition-transform"
              aria-label="خيارات التصفية والفرز"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
              <span>فلاتر</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar: Clean 1-Row Native Horizontal Swipe on Mobile (No wrap pile-up) */}
        <section aria-label="تصنيفات الدورات" className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 mb-2 px-1">
            <span className="text-[11px] sm:text-xs font-black text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-primary" />
              <span>المسارات التعليمية</span>
            </span>
            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                className="text-[11px] sm:text-xs font-bold text-brand-primary hover:underline"
              >
                عرض كل المسارات
              </button>
            )}
          </div>

          {/* 
              On Mobile: Single sleek horizontal scroll bar (snap-x overflow-x-auto, no vertical clutter, exactly like YouTube/Airbnb pills)
              On Desktop (md+): Responsive wrapped rows with colors
          */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 px-0.5 scrollbar-none no-scrollbar snap-x md:flex-wrap md:overflow-visible">
            {/* "All Categories" Pill */}
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={`h-8 sm:h-9 px-3.5 rounded-xl text-xs font-black transition-all border shrink-0 flex items-center gap-1.5 snap-start ${
                selectedCategory === "all"
                  ? "bg-[#2c1a4d] text-white border-[#2c1a4d] shadow-sm shadow-[#2c1a4d]/25"
                  : "bg-surface hover:bg-surface/80 text-text-secondary border-border/50 hover:text-text-primary"
              }`}
            >
              <span>جميع المسارات</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === "all" ? "bg-white/20 text-white" : "bg-border/60 text-text-secondary"
                }`}
              >
                {courses.length}
              </span>
            </button>

            {/* Individual Categories with their colors */}
            {allCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const count = courses.filter((c) => (c.categories || "").trim() === cat.name).length;
              const color = cat.color;

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  style={{
                    backgroundColor: isSelected ? color : undefined,
                    borderColor: isSelected ? color : `${color}45`,
                    color: isSelected ? "#ffffff" : undefined,
                  }}
                  className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 shadow-sm snap-start ${
                    isSelected
                      ? "shadow-md scale-[1.01]"
                      : "bg-surface hover:bg-surface/80 text-text-primary hover:scale-[1.01]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 border border-white/40"
                    style={{ backgroundColor: isSelected ? "#ffffff" : color }}
                  />

                  <span className="whitespace-nowrap">{cat.name}</span>

                  {count > 0 && (
                    <span
                      style={{
                        backgroundColor: isSelected ? "rgba(255, 255, 255, 0.25)" : `${color}18`,
                        color: isSelected ? "#ffffff" : color,
                      }}
                      className="text-[9px] px-1.5 py-0.2 rounded-full font-black tracking-tight"
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Desktop Filter Controls Toolbar (Hidden on Mobile, replaced by Bottom Sheet Modal) */}
        <section aria-label="شريط أدوات التصفية والترتيب" className="hidden md:block bg-surface/60 backdrop-blur-md border border-border/50 rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Quick Availability Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-text-secondary ml-1">الحالة:</span>

              <button
                type="button"
                onClick={() => setSelectedAvailability("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedAvailability === "all"
                    ? "bg-[#2c1a4d] text-white border-[#2c1a4d]"
                    : "bg-background/80 text-text-secondary border-border/40 hover:bg-background"
                }`}
              >
                الكل
              </button>

              <button
                type="button"
                onClick={() => setSelectedAvailability("ready")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  selectedAvailability === "ready"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-background/80 text-text-secondary border-border/40 hover:text-emerald-500 hover:bg-background"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>متاحة فوراً</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAvailability("coming_soon")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  selectedAvailability === "coming_soon"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-background/80 text-text-secondary border-border/40 hover:text-amber-500 hover:bg-background"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>قريباً (حجز مسبق)</span>
              </button>
            </div>

            {/* Sort & Toggle Advanced */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-secondary">الترتيب:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="ترتيب الدورات"
                    className="bg-background border border-border/50 text-text-primary text-xs font-bold rounded-xl py-2 px-3 pl-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    {Object.entries(SORT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  showAdvancedFilters || activeFiltersCount > (selectedCategory !== "all" ? 1 : 0)
                    ? "bg-brand-primary/15 text-brand-primary border-brand-primary/40"
                    : "bg-background text-text-secondary border-border/50 hover:text-text-primary"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>فلاتر إضافية</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                  title="إعادة ضبط الفلاتر"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>مسح الفلاتر</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Expandable Drawer */}
          {showAdvancedFilters && (
            <div className="mt-5 pt-5 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-text-primary block">المستوى الأكاديمي</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as LevelFilter)}
                  aria-label="المستوى"
                  className="w-full bg-background border border-border/50 rounded-xl p-2.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-text-primary block">نطاق السعر (TND)</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
                  aria-label="نطاق السعر"
                  className="w-full bg-background border border-border/50 rounded-xl p-2.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {Object.entries(PRICE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-text-primary block">حالة الدورة</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value as AvailabilityFilter)}
                  aria-label="حالة التوفر"
                  className="w-full bg-background border border-border/50 rounded-xl p-2.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {Object.entries(AVAILABILITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary font-bold">
            <div className="flex items-center gap-2">
              <span>النتائج:</span>
              <span className="text-brand-primary font-black px-2 py-0.5 rounded-md bg-brand-primary/10">
                {filteredCourses.length} دورة
              </span>
              {selectedCategory !== "all" && (
                <span className="text-text-secondary/70">ضمن مسار: {selectedCategory}</span>
              )}
            </div>

            {filteredCourses.length !== courses.length && (
              <span className="text-[11px] text-text-secondary/60">
                من إجمالي {courses.length} دورة
              </span>
            )}
          </div>
        </section>

        {/* Mobile Filter Sub-header (Quick Results count & active tags) */}
        <div className="flex md:hidden items-center justify-between gap-2 mb-4 px-1 text-xs font-bold text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span>النتائج:</span>
            <span className="text-brand-primary font-black bg-brand-primary/10 px-2 py-0.5 rounded-lg">
              {filteredCourses.length} دورة
            </span>
            {selectedCategory !== "all" && currentCategoryObj && (
              <span
                style={{ backgroundColor: `${currentCategoryObj.color}15`, color: currentCategoryObj.color }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-black truncate max-w-[130px]"
              >
                {selectedCategory}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-red-500 hover:text-red-600 text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        {isCoursesLoading && courses.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface/50 rounded-[28px] sm:rounded-[32px] h-[400px] sm:h-[450px] animate-pulse border border-border/40"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="py-16 sm:py-24 text-center bg-surface/30 rounded-[28px] sm:rounded-[32px] border border-dashed border-border/60 p-6 sm:p-8 max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto text-brand-primary">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-text-primary">لا توجد دورات تطابق معايير البحث</h3>
                <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed">
                  لم نتمكن من العثور على أي دورة تطابق الفلاتر المحددة حالياً. يمكنك تجربة تعديل الكلمات المفتاحية أو مسح بعض الفلاتر.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة ضبط جميع الفلاتر</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filters Bottom Sheet Modal */}
      {mobileFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          {/* Backdrop Click */}
          <div
            className="flex-1"
            onClick={() => setMobileFilterModalOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet Body */}
          <div className="bg-surface border-t border-border/60 rounded-t-[32px] p-5 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                <h3 className="text-base font-black text-text-primary">تصفية وترتيب الدورات</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterModalOpen(false)}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-background transition-colors"
                aria-label="إغلاق نافذة التصفية"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-text-primary block">ترتيب النتائج</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="ترتيب النتائج"
                  className="w-full bg-background border border-border/50 text-text-primary text-xs font-bold rounded-xl py-3 px-3 pl-8 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {Object.entries(SORT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-text-primary block">حالة الدورة</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAvailability("all")}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    selectedAvailability === "all"
                      ? "bg-[#2c1a4d] text-white border-[#2c1a4d]"
                      : "bg-background text-text-secondary border-border/40"
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAvailability("ready")}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    selectedAvailability === "ready"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-background text-text-secondary border-border/40"
                  }`}
                >
                  متاحة فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAvailability("coming_soon")}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    selectedAvailability === "coming_soon"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-background text-text-secondary border-border/40"
                  }`}
                >
                  قريباً
                </button>
              </div>
            </div>

            {/* Academic Level */}
            <div className="space-y-2">
              <label className="text-xs font-black text-text-primary block">المستوى الأكاديمي</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LevelFilter)}
                aria-label="المستوى الأكاديمي"
                className="w-full bg-background border border-border/50 text-text-primary text-xs font-bold rounded-xl py-3 px-3 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-text-primary block">نطاق السعر</label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
                aria-label="نطاق السعر"
                className="w-full bg-background border border-border/50 text-text-primary text-xs font-bold rounded-xl py-3 px-3 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                {Object.entries(PRICE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Actions Footer in Sheet */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterModalOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-brand-primary text-white font-black text-xs shadow-lg active:scale-95 transition-transform text-center"
              >
                عرض النتائج ({filteredCourses.length})
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-3 px-4 rounded-2xl bg-background border border-border/50 text-red-500 font-bold text-xs"
                >
                  إعادة ضبط
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background text-text-primary text-right" dir="rtl">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
          <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">جاري فتح الكتالوج...</p>
        </div>
      </div>
    </div>
  );
}

export default function CoursesListPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CoursesListContent />
    </Suspense>
  );
}
