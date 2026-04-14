"use client";

import { useAuthStore } from "@/store/auth";
import { useCourseStore, Course } from "@/store/course";
import { CourseForm } from "../CourseForm";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateCoursePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { createCourse, isLoading } = useCourseStore();

  const handleSubmit = async (data: Partial<Course>) => {
    if (!token) return;
    
    try {
      await createCourse(data, token);
      router.push("/admin/courses");
    } catch (err) {
      console.error("Create course error:", err);
    }
  };

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
            <h1 className="text-2xl font-extrabold text-[#2c1a4d]">Create New Course</h1>
            <p className="text-sm text-gray-500 font-medium">Design your curriculum and launch a new learning experience.</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CourseForm 
          onSubmit={handleSubmit} 
          onCancel={() => router.push("/admin/courses")}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
