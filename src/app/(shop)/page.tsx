"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { useArticleStore } from "@/store/article";
import { useCategoryStore } from "@/store/category";
import { HeroSection } from "../../components/HeroSection/HeroSection";
import { FeaturesSection } from "../../components/FeaturesSection/FeaturesSection";
import { CategoriesSection } from "../../components/CategoriesSection/CategoriesSection";
import { LatestCoursesSection } from "../../components/LatestCoursesSection/LatestCoursesSection";
import { LatestArticlesSection } from "../../components/LatestArticlesSection/LatestArticlesSection";
import { InstructorsSection } from "../../components/InstructorsSection/InstructorsSection";

export default function HomePage() {
  const { articles, isLoading: isArticlesLoading, getPublicArticles } = useArticleStore();
  const { courses, isLoading: isCoursesLoading, getPublicCourses } = useCourseStore();
  const { categories, getPublicCategories } = useCategoryStore();

  useEffect(() => {
    getPublicArticles();
    getPublicCourses();
    getPublicCategories();
  }, [getPublicArticles, getPublicCourses, getPublicCategories]);

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
      <LatestCoursesSection courses={courses} isLoading={isCoursesLoading} />
      <InstructorsSection />
      <LatestArticlesSection articles={articles} isLoading={isArticlesLoading} />
    </div>
  );
}
