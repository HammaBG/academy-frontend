"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useCourseStore, Course } from "@/store/course";
import { CourseForm } from "../../CourseForm";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentCourse, getCourseById, updateCourse, isLoading, clearCurrentCourse } = useCourseStore();

  useEffect(() => {
    if (token && id) {
      getCourseById(id as string, token);
    }
    return () => clearCurrentCourse();
  }, [id, token, getCourseById, clearCurrentCourse]);

  const handleSubmit = async (data: Partial<Course>) => {
    if (!token || !id) return;
    
    try {
      await updateCourse(id as string, data, token);
      router.push("/admin/courses");
    } catch (err) {
      console.error("Update course error:", err);
    }
  };

  if (isLoading && !currentCourse) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
        <p className="text-[#8b3d6f] font-bold animate-pulse text-lg uppercase tracking-widest">Loading Course Blueprint...</p>
      </div>
    );
  }

  if (!currentCourse && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
           <ChevronLeft className="w-10 h-10 text-red-400 rotate-180" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#2c1a4d]">Course not found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">The course you're trying to edit doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/courses")} className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold px-8">
          Back to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/admin/courses")}
            className="text-gray-400 hover:text-[#8b3d6f] hover:bg-purple-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2c1a4d]">Edit Course</h1>
            <p className="text-sm text-gray-500 font-medium truncate max-w-[400px]">Upgrading "{currentCourse?.name}"</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CourseForm 
          course={currentCourse}
          onSubmit={handleSubmit} 
          onCancel={() => router.push("/admin/courses")}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
